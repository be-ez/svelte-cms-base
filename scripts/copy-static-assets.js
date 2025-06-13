#!/usr/bin/env node
/* eslint-disable no-console */

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function copyRecursiveSync(src, dest) {
	const exists = existsSync(src);
	const stats = exists && statSync(src);
	const isDirectory = exists && stats.isDirectory();

	if (isDirectory) {
		mkdirSync(dest, { recursive: true });
		readdirSync(src).forEach(childItemName => {
			copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
		});
	} else {
		copyFileSync(src, dest);
	}
}

// Copy images directory
const imagesSource = 'static/images';
const imagesDest = 'build/images';

if (existsSync(imagesSource)) {
	console.log('Copying images directory to build...');
	copyRecursiveSync(imagesSource, imagesDest);
	console.log('✓ Images copied successfully');
} else {
	console.warn('⚠ No images directory found in static/');
}

// Copy image manifest
const manifestSource = 'static/image-manifest.json';
const manifestDest = 'build/image-manifest.json';

if (existsSync(manifestSource)) {
	console.log('Copying image-manifest.json to build...');
	copyFileSync(manifestSource, manifestDest);
	console.log('✓ Image manifest copied successfully');
} else {
	console.warn('⚠ No image-manifest.json found in static/');
}
