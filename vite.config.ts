import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [
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
