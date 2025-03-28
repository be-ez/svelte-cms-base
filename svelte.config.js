// import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import { imagetools } from 'vite-imagetools';

import { importAssets } from 'svelte-preprocess-import-assets';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	remarkPlugins: [],
	layout: {
		_: './src/components/utils/mdsvex_layout.svelte'
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions), importAssets()],
	extensions: ['.svelte', '.svx', '.md'],
	plugins: [imagetools({ force: true })],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		// Include files from static directory in the build
		files: {
			assets: './static'
		}
	}
};

export default config;
