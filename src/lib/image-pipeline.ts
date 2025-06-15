import { readFiles } from '@directus/sdk';
import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

import getDirectusInstance from './directus';
import {
	generateProcessedFilename,
	IMAGE_FORMATS,
	IMAGE_SIZES,
	type ImageFormatKey,
	type ImageSizeKey,
	type ProcessedImage
} from './image-config';

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
		metadata: {
			width: metadata.width || 0,
			height: metadata.height || 0,
			aspectRatio: metadata.width && metadata.height ? metadata.width / metadata.height : 1
		},
		sizes: {} as ProcessedImage['sizes']
	};

	// Initialize sizes object
	for (const sizeKey of Object.keys(IMAGE_SIZES) as ImageSizeKey[]) {
		processedImage.sizes[sizeKey] = {} as any;
		for (const formatKey of Object.keys(IMAGE_FORMATS) as ImageFormatKey[]) {
			processedImage.sizes[sizeKey][formatKey] = '';
		}
	}

	// Process all sizes and formats in parallel
	const processingTasks: Promise<void>[] = [];

	for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES) as [
		ImageSizeKey,
		(typeof IMAGE_SIZES)[ImageSizeKey]
	][]) {
		for (const [formatName, formatConfig] of Object.entries(IMAGE_FORMATS) as [
			ImageFormatKey,
			(typeof IMAGE_FORMATS)[ImageFormatKey]
		][]) {
			const task = (async () => {
				const outputFilename = generateProcessedFilename(filename, sizeName, formatName);
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

					if (sizeConfig.width) {
						pipeline = pipeline.resize(sizeConfig.width, null, {
							fit: 'inside'
						});
					}

					if (formatName === 'webp') {
						pipeline = pipeline.webp({
							quality: formatConfig.quality,
							...formatConfig.options
						});
					} else if (formatName === 'jpg') {
						pipeline = pipeline.jpeg({
							quality: formatConfig.quality,
							...formatConfig.options
						});
					}

					await pipeline.toFile(outputPath);
					console.warn('Successfully processed:', outputFilename);
					processedImage.sizes[sizeName][formatName] = outputFilename;
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

// Helper function to check if all variants of an image exist
async function imageAlreadyExists(imageId: string, outputDir: string): Promise<boolean> {
	try {
		// Check all expected size and format combinations
		for (const [sizeName] of Object.entries(IMAGE_SIZES) as [ImageSizeKey, any][]) {
			for (const [formatName] of Object.entries(IMAGE_FORMATS) as [ImageFormatKey, any][]) {
				const expectedFilename = generateProcessedFilename('temp', sizeName, formatName).replace(
					'temp',
					imageId
				);
				const expectedPath = join(outputDir, expectedFilename);

				const exists = await doesFileExist(expectedPath);
				if (!exists) {
					return false;
				}
			}
		}
		return true;
	} catch (error) {
		return false;
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
				// Check if image already exists
				const alreadyExists = await imageAlreadyExists(id, outputDir);
				if (alreadyExists) {
					console.warn(`✓ Skipping ${id} - already processed`);
					// Return a basic manifest entry for existing image
					const processedImage: ProcessedImage = {
						originalPath: url,
						metadata: {
							width: 0,
							height: 0,
							aspectRatio: 1
						},
						sizes: {} as any
					};

					// Build the sizes object for the manifest
					for (const [sizeName] of Object.entries(IMAGE_SIZES) as [ImageSizeKey, any][]) {
						processedImage.sizes[sizeName] = {} as any;
						for (const [formatName] of Object.entries(IMAGE_FORMATS) as [ImageFormatKey, any][]) {
							const filename = generateProcessedFilename('temp', sizeName, formatName).replace(
								'temp',
								id
							);
							processedImage.sizes[sizeName][formatName] = filename;
						}
					}

					return { id, processedImage };
				}

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
