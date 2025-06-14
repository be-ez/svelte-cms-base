#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, no-console, @typescript-eslint/no-unused-vars */

// Load environment variables from .env file
require('dotenv').config();

const { readFiles, readItems } = require('@directus/sdk');
const { access, mkdir, readdir, readFile, writeFile } = require('fs/promises');
const { join } = require('path');
const sharp = require('sharp');
const { authentication, createDirectus, rest } = require('@directus/sdk');

// Configuration
const IMAGE_SIZES = {
	thumbnail: { width: 150 },
	small: { width: 400 },
	medium: { width: 800 },
	large: { width: 1200 },
	display: { width: 1920 },
	original: { width: null }
};

const IMAGE_FORMATS = {
	webp: { quality: 80 },
	jpg: { quality: 85 }
};

async function downloadImage(url, token) {
	console.log('Downloading image from:', url);

	// Use native fetch in Node.js 18+
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to download image: ${response.statusText}`);
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	return { buffer, contentType: response.headers.get('content-type') };
}

async function processImage(buffer, imageId, outputDir) {
	const processedImage = {
		originalPath: `${process.env.DIRECTUS_API_URL}/assets/${imageId}`,
		sizes: {}
	};

	for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
		processedImage.sizes[sizeName] = {};

		for (const [formatName, formatConfig] of Object.entries(IMAGE_FORMATS)) {
			const outputFilename = `${imageId}-${sizeName}.${formatName}`;
			const outputPath = join(outputDir, outputFilename);

			try {
				let pipeline = sharp(buffer, { failOnError: false });

				if (sizeConfig.width) {
					pipeline = pipeline.resize(sizeConfig.width, null, { fit: 'inside' });
				}

				if (formatName === 'webp') {
					pipeline = pipeline.webp({ quality: formatConfig.quality });
				} else {
					pipeline = pipeline.jpeg({ quality: formatConfig.quality });
				}

				await pipeline.toFile(outputPath);
				console.log('Processed:', outputFilename);
				processedImage.sizes[sizeName][formatName] = outputFilename;
			} catch (error) {
				console.error(`Error processing ${outputFilename}:`, error.message);
			}
		}
	}

	return processedImage;
}

async function scanMarkdownForImages(directus) {
	console.log('🔍 Scanning markdown content for image references...');

	const collections = ['posts', 'recipes', 'secret_files'];
	const imageIds = new Set();

	// Regex patterns to find image IDs in markdown
	const imagePatterns = [
		/!\[.*?\]\(([a-f0-9-]{36})\)/gi, // ![alt](uuid)
		/!\[.*?\]\(.*?\/([a-f0-9-]{36})\)/gi, // ![alt](url/uuid)
		/!\[.*?\]\(.*?assets\/([a-f0-9-]{36})\)/gi // ![alt](assets/uuid)
	];

	for (const collection of collections) {
		try {
			console.log(`Scanning ${collection}...`);
			const items = await directus.request(
				readItems(collection, {
					fields: ['id', 'body', 'content'] // Include common markdown field names
				})
			);

			for (const item of items) {
				// Check different possible markdown field names
				const markdownFields = [item.body, item.content].filter(Boolean);

				for (const markdown of markdownFields) {
					if (typeof markdown === 'string') {
						for (const pattern of imagePatterns) {
							let match;
							while ((match = pattern.exec(markdown)) !== null) {
								const imageId = match[1];
								if (imageId && imageId.length === 36) {
									// Valid UUID length
									imageIds.add(imageId);
									console.log(`Found image reference: ${imageId} in ${collection}`);
								}
							}
						}
					}
				}
			}
		} catch (error) {
			console.warn(`Could not scan ${collection} collection:`, error.message);
		}
	}

	console.log(`📝 Found ${imageIds.size} unique image references in markdown content`);
	return Array.from(imageIds);
}

async function main() {
	const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;
	const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

	if (!DIRECTUS_API_URL || !DIRECTUS_TOKEN) {
		console.error('Missing DIRECTUS_API_URL or DIRECTUS_TOKEN');
		process.exit(1);
	}

	console.log('🖼️  Processing images from Directus...');
	console.log('API URL:', DIRECTUS_API_URL);

	try {
		// Create Directus client
		const directus = createDirectus(DIRECTUS_API_URL).with(rest()).with(authentication());

		// Set the token
		await directus.setToken(DIRECTUS_TOKEN);

		// Get all files from Directus
		const files = await directus.request(readFiles());
		console.log('Found files:', files.length);

		// Scan markdown content for additional image references
		const markdownImageIds = await scanMarkdownForImages(directus);

		// Create file objects for markdown-referenced images that aren't in the files list
		const existingFileIds = new Set(files.map(f => f.id));
		const additionalImages = markdownImageIds
			.filter(id => !existingFileIds.has(id))
			.map(id => ({ id, filename_download: `${id}.jpg` })); // Create minimal file objects

		// Combine all images to process
		const allImages = [...files, ...additionalImages];
		console.log(
			`Total images to process: ${allImages.length} (${files.length} from files + ${additionalImages.length} from markdown)`
		);

		const outputDir = 'static/images/processed';
		await mkdir(outputDir, { recursive: true });

		const processedImages = {};
		const BATCH_SIZE = 3;

		// Check for existing manifest
		let existingManifest = {};
		try {
			const manifestContent = await readFile('static/image-manifest.json', 'utf-8');
			existingManifest = JSON.parse(manifestContent);
			console.log(`Found existing manifest with ${Object.keys(existingManifest).length} images`);
		} catch (error) {
			console.log('No existing manifest found');
		}

		// Process in batches
		let skipped = 0;
		let processed = 0;

		for (let i = 0; i < allImages.length; i += BATCH_SIZE) {
			const batch = allImages.slice(i, i + BATCH_SIZE);

			await Promise.all(
				batch.map(async file => {
					try {
						// Check if all expected files exist
						let allExist = true;
						for (const size of Object.keys(IMAGE_SIZES)) {
							for (const format of Object.keys(IMAGE_FORMATS)) {
								const filename = `${file.id}-${size}.${format}`;
								try {
									await access(join(outputDir, filename));
								} catch {
									allExist = false;
									break;
								}
							}
							if (!allExist) break;
						}

						if (allExist && existingManifest[file.id]) {
							console.log(`✓ Skipping ${file.id} - already processed`);
							processedImages[file.id] = existingManifest[file.id];
							skipped++;
							return;
						}

						const url = `${DIRECTUS_API_URL}/assets/${file.id}`;
						const { buffer, contentType } = await downloadImage(url, DIRECTUS_TOKEN);

						if (!contentType || !contentType.startsWith('image/')) {
							console.log(`Skipping non-image file: ${file.id}`);
							return;
						}

						const processedImage = await processImage(buffer, file.id, outputDir);
						processedImages[file.id] = processedImage;
						processed++;
					} catch (error) {
						console.error(`Error processing ${file.id}:`, error.message);
					}
				})
			);
		}

		// Write manifest
		await writeFile('static/image-manifest.json', JSON.stringify(processedImages, null, 2));

		console.log('✅ Image processing complete!');
		console.log(`Total images: ${Object.keys(processedImages).length}`);
		console.log(`Newly processed: ${processed}`);
		console.log(`Skipped (already exist): ${skipped}`);
	} catch (error) {
		console.error('❌ Image processing failed:', error);
		process.exit(1);
	}
}

main();
