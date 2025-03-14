import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';

import { DIRECTUS_API_URL, DIRECTUS_TOKEN } from '$env/static/private';

type FetchType = typeof fetch;

interface DirectusSchema {
	posts: {
		id: string;
		title: string;
		subtitle: string;
		content: string;
		date_created: string;
		slug: string;
		status: string;
	};
	photos: {
		id: string;
		title: string;
		description: string;
		date_created: string;
		slug: string;
		status: string;
		image: string;
	};
	recipes: {
		id: string;
		title: string;
		content: string;
		date_created: string;
		slug: string;
		status: string;
	};
	about: {
		id: string;
		content: string;
	};
	global: {
		Title: string;
		Description: string;
	};
	secret_files: {
		id: string;
		password: string;
		title: string;
		body: string;
		files?: Array<{
			directus_files_id: {
				id: string;
				filename_download: string;
			};
		}>;
	};
	images: {
		id: string;
		title: string;
		description: string;
		date_created: string;
		slug: string;
		status: string;
		image: string;
	};
}

type Collections = keyof DirectusSchema;

async function readCollection<T extends Collections>(
	directus: ReturnType<typeof getDirectusInstance>,
	collection: T,
	options?: Record<string, unknown>
): Promise<DirectusSchema[T][]> {
	// @ts-expect-error - Directus SDK type issue
	return await directus.request(readItems(collection, options));
}

function getDirectusInstance(customFetch?: FetchType) {
	const options = customFetch ? { globals: { fetch: customFetch } } : {};
	return createDirectus<DirectusSchema>(DIRECTUS_API_URL, options)
		.with(staticToken(DIRECTUS_TOKEN))
		.with(rest());
}

export default getDirectusInstance;
export { readCollection };
export type { DirectusSchema };
