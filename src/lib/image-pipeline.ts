import { readFiles } from '@directus/sdk';
import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

import getDirectusInstance from './directus';

export interface ImageSizes {
	thumbnail: { width: number };
	small: { width: number };
	medium: { width: number };
	large: { width: number };
	display: { width: number };
	original: null;
}

const SIZES: ImageSizes = {
	thumbnail: { width: 400 },
	small: { width: 800 },
	medium: { width: 1200 },
	large: { width: 1800 },
	display: { width: 2400 },
	original: null
};

const IMAGE_FORMATS = ['webp', 'jpg'] as const;
export type ImageFormat = (typeof IMAGE_FORMATS)[number];

export interface ProcessedImage {
	originalPath: string; // This will store the original file URL
	sizes: {
		[K in keyof ImageSizes]: {
			[F in ImageFormat]: string;
		};
	};
}

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'];

// EXIF Orientation values and their corresponding rotations
const ORIENTATION_ROTATIONS = {
	1: 0, // Normal
	2: 0, // Flipped horizontally
	3: 180, // Rotated 180°
	4: 180, // Flipped vertically
	5: 90, // Rotated 90° CCW and flipped
	6: 90, // Rotated 90° CW
	7: 270, // Rotated 270° CW and flipped
	8: 270 // Rotated 270° CW
};

async function ensureDir(dir: string) {
	await mkdir(dir, { recursive: true });
}

async function doesFileExist(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function downloadImage(
	url: string,
	token: string
): Promise<{ buffer: Buffer; contentType: string | null }> {
	console.warn('Downloading image from:', url);
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
	}

	const contentType = response.headers.get('content-type');
	console.warn('Image content type:', contentType);

	const arrayBuffer = await response.arrayBuffer();
	return {
		buffer: Buffer.from(arrayBuffer),
		contentType
	};
}

async function processImage(
	buffer: Buffer,
	filename: string,
	outputDir: string,
	originalUrl: string
): Promise<ProcessedImage> {
	// Get original metadata
	const metadata = await sharp(buffer).metadata();
	console.warn(
		'Processing image:',
		filename,
		'Format:',
		metadata.format,
		'Orientation:',
		metadata.orientation
	);

	if (!metadata.format) {
		throw new Error(`Unable to determine format for image: ${filename}`);
	}

	const processedImage: ProcessedImage = {
		originalPath: originalUrl, // Store the original file URL
		sizes: {
			thumbnail: { webp: '', jpg: '' },
			small: { webp: '', jpg: '' },
			medium: { webp: '', jpg: '' },
			large: { webp: '', jpg: '' },
			display: { webp: '', jpg: '' },
			original: { webp: '', jpg: '' }
		}
	};

	// Process all sizes and formats in parallel
	const processingTasks: Promise<void>[] = [];

	for (const [sizeName, dimensions] of Object.entries(SIZES)) {
		for (const format of IMAGE_FORMATS) {
			const task = (async () => {
				const outputFilename = `${filename}-${sizeName}.${format}`;
				const outputPath = join(outputDir, outputFilename);

				try {
					// Start with a fresh pipeline for each size
					let pipeline = sharp(buffer, {
						failOnError: false
					});

					// Handle orientation
					if (metadata.orientation && metadata.orientation in ORIENTATION_ROTATIONS) {
						const rotation =
							ORIENTATION_ROTATIONS[metadata.orientation as keyof typeof ORIENTATION_ROTATIONS];
						if (rotation !== 0) {
							console.warn(
								`Applying rotation of ${rotation}° for orientation ${metadata.orientation}`
							);
							pipeline = pipeline.rotate(rotation);
						}
					}

					// Remove EXIF data but keep color profiles
					pipeline = pipeline.withMetadata({
						orientation: 1, // Reset orientation to normal
						exif: {} // Remove EXIF data
						// icc: true // Keep color profiles
					});

					if (dimensions) {
						if ('height' in dimensions) {
							pipeline = pipeline.resize(dimensions.width, dimensions.height, {
								fit: 'cover',
								position: 'attention'
							});
						} else {
							pipeline = pipeline.resize(dimensions.width, null, {
								fit: 'inside'
							});
						}
					}

					if (format === 'webp') {
						pipeline = pipeline.webp({
							quality: 80,
							effort: 4
						});
					} else {
						pipeline = pipeline.jpeg({
							quality: 80,
							mozjpeg: true
						});
					}

					await pipeline.toFile(outputPath);
					console.warn('Successfully processed:', outputFilename);
					processedImage.sizes[sizeName as keyof ImageSizes][format] = outputFilename;
				} catch (error) {
					console.error(`Error processing ${outputFilename}:`, error);
					throw error;
				}
			})();
			processingTasks.push(task);
		}
	}

	// Wait for all size/format combinations to complete
	await Promise.all(processingTasks);
	return processedImage;
}

export async function shouldRegenerateAssets(): Promise<boolean> {
	console.warn('Checking if assets need regeneration...');

	const outputDir = 'static/images/processed';
	const manifestPath = 'static/image-manifest.json';

	try {
		const dirExists = await doesFileExist(outputDir);
		if (!dirExists) {
			console.warn('Output directory does not exist');
			return true;
		}

		// Check if manifest exists and can be read
		let manifest: Record<string, ProcessedImage>;
		try {
			const manifestContent = await readFile(manifestPath, 'utf-8');
			manifest = JSON.parse(manifestContent);

			// Check if manifest only contains placeholder entries
			const keys = Object.keys(manifest);
			if (keys.length === 0 || (keys.length === 1 && keys[0] === '__placeholder__')) {
				console.warn('Manifest only contains placeholder entries');
				return true;
			}
		} catch (error) {
			console.warn('Failed to read manifest:', error);
			return true;
		}

		// Get list of files in the output directory
		const files = await readdir(outputDir);
		if (files.length === 0) {
			console.warn('Output directory is empty');
			return true;
		}

		// Verify that all images in manifest have their files
		for (const imageData of Object.values(manifest)) {
			for (const sizeFormats of Object.values(imageData.sizes)) {
				for (const filename of Object.values(sizeFormats)) {
					const exists = await doesFileExist(join(outputDir, filename));
					if (!exists) {
						console.warn(`Missing file: ${filename}`);
						return true;
					}
				}
			}
		}

		console.warn('All assets verified successfully');
		return false;
	} catch (error) {
		console.error('Error checking assets:', error);
		return true;
	}
}

// Helper function to process images in batches
async function processBatch(
	batch: { id: string; url: string }[],
	token: string,
	apiUrl: string,
	outputDir: string
): Promise<Record<string, ProcessedImage>> {
	const batchResults = await Promise.all(
		batch.map(async ({ id, url }) => {
			try {
				console.warn('Processing file:', id);
				const { buffer, contentType } = await downloadImage(url, token);

				// Skip unsupported file types
				if (!contentType || !SUPPORTED_MIME_TYPES.includes(contentType)) {
					console.warn(`Skipping unsupported file type: ${contentType}`);
					return null;
				}

				const processedImage = await processImage(buffer, id, outputDir, url);
				return { id, processedImage };
			} catch (error) {
				console.warn(`Skipping file ${id} due to error:`, error);
				return null;
			}
		})
	);

	return batchResults.reduce(
		(acc, result) => {
			if (result) {
				acc[result.id] = result.processedImage;
			}
			return acc;
		},
		{} as Record<string, ProcessedImage>
	);
}

export async function buildImagePipeline(apiUrl: string, token: string) {
	console.warn('Starting image pipeline...');
	const directus = getDirectusInstance(fetch);
	const files = await directus.request(readFiles({}));
	console.warn('Found files:', files.length);

	const outputDir = 'static/images/processed';
	await ensureDir(outputDir);

	const processedImages: Record<string, ProcessedImage> = {};
	const BATCH_SIZE = 3; // Process 3 images concurrently

	// Prepare batches of images
	const batches = [];
	for (let i = 0; i < files.length; i += BATCH_SIZE) {
		const batch = files.slice(i, i + BATCH_SIZE).map(file => ({
			id: file.id,
			url: `${apiUrl}/assets/${file.id}`
		}));
		batches.push(batch);
	}

	// Process batches sequentially, but images within each batch in parallel
	for (const batch of batches) {
		const batchResults = await processBatch(batch, token, apiUrl, outputDir);
		Object.assign(processedImages, batchResults);
	}

	// Save the manifest only to static directory for fetch access
	const manifestPath = 'static/image-manifest.json';
	await writeFile(manifestPath, JSON.stringify(processedImages, null, 2));

	console.warn('Image pipeline complete. Manifest saved to:', manifestPath);
}
