import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
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
