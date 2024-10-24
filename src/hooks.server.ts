import type { Handle } from '@sveltejs/kit';
import { buildImagePipeline, shouldRegenerateAssets } from '$lib/image-pipeline';
import { DIRECTUS_TOKEN, DIRECTUS_API_URL } from '$env/static/private';

let initializationPromise: Promise<void> | null = null;

async function ensureAssets() {
	if (!initializationPromise) {
		initializationPromise = (async () => {
			try {
				const needsRegeneration = await shouldRegenerateAssets();
				if (needsRegeneration) {
					console.log('Assets missing or incomplete, starting image pipeline...');
					await buildImagePipeline(DIRECTUS_API_URL, DIRECTUS_TOKEN);
					console.log('Image pipeline completed successfully');
				} else {
					console.log('Assets already exist, skipping image pipeline');
				}
			} catch (error) {
				console.error('Error during asset initialization:', error);
				initializationPromise = null; // Allow retry
				throw error;
			}
		})();
	}
	return initializationPromise;
}

export const handle: Handle = async ({ event, resolve }) => {
	try {
		await ensureAssets();
	} catch (error) {
		console.error('Failed to initialize assets:', error);
		return new Response('Server Error: Failed to process images', { status: 500 });
	}

	return await resolve(event, {
		filterSerializedResponseHeaders: (key) => {
			return key.toLowerCase() === 'content-type';
		}
	});
};
