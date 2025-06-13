import type { Handle } from '@sveltejs/kit';

import { DIRECTUS_API_URL, DIRECTUS_TOKEN } from '$env/static/private';
import { buildImagePipeline, shouldRegenerateAssets } from '$lib/image-pipeline';

let initializationPromise: Promise<void> | null = null;

async function ensureAssets() {
	if (!initializationPromise) {
		initializationPromise = (async () => {
			try {
				const needsRegeneration = await shouldRegenerateAssets();
				if (needsRegeneration) {
					console.warn('Assets missing or incomplete, starting image pipeline...');
					await buildImagePipeline(DIRECTUS_API_URL, DIRECTUS_TOKEN);
					console.warn('Image pipeline completed successfully');
				} else {
					console.warn('Assets already exist, skipping image pipeline');
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

	const response = await resolve(event, {
		filterSerializedResponseHeaders: key => {
			return key.toLowerCase() === 'content-type';
		}
	});

	// Security headers
	const headers = new Headers(response.headers);
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('X-Frame-Options', 'DENY');
	headers.set('X-XSS-Protection', '1; mode=block');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// Basic CSP - adjust based on your needs
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for SvelteKit
		"style-src 'self' 'unsafe-inline'", // Needed for inline styles
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self' " + DIRECTUS_API_URL,
		"frame-src 'none'",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'"
	].join('; ');

	headers.set('Content-Security-Policy', csp);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};
