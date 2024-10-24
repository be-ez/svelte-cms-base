import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';

type FetchType = typeof fetch;

type Collections = 'posts' | 'photos' | 'recipes' | 'about' | 'global' | 'secret_files';

export async function loadDirectusItems(
	customFetch: FetchType,
	collection: Collections,
	options?: Record<string, unknown>
) {
	const directus = getDirectusInstance(customFetch);
	// @ts-expect-error - Directus SDK type issue
	const response = await directus.request(readItems(collection, options));
	return { [collection]: response };
}
