import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		enhancedImages(),
		imagetools({
			defaultDirectives: () => {
				return new URLSearchParams({
					format: 'webp',
					quality: '80'
				});
			}
		})
	],
	// Ensure assets are processed during build
	build: {
		assetsInlineLimit: 0
	}
});
