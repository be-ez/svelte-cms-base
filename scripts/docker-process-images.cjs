#!/usr/bin/env node

// This script is used during Docker builds to process images
// It's a simple wrapper that loads the TypeScript files using esbuild-register

// Mock the $env/static/private module that SvelteKit provides
require('module').Module._extensions['.ts'] = require('esbuild-register/dist/node').register().loader;

// Create a mock for $env/static/private
require.cache[require.resolve.paths('$env/static/private')[0] + '/$env/static/private'] = {
  exports: {
    DIRECTUS_API_URL: process.env.DIRECTUS_API_URL,
    DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN
  }
};

const { buildImagePipeline } = require('../src/lib/image-pipeline.ts');

const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_API_URL || !DIRECTUS_TOKEN) {
  console.error('Missing DIRECTUS_API_URL or DIRECTUS_TOKEN');
  process.exit(1);
}

console.log('🖼️  Processing images from Directus...');
console.log('API URL:', DIRECTUS_API_URL);

buildImagePipeline(DIRECTUS_API_URL, DIRECTUS_TOKEN)
  .then(() => {
    console.log('✅ Image processing complete!');
  })
  .catch(error => {
    console.error('❌ Image processing failed:', error);
    process.exit(1);
  });