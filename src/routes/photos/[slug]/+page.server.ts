import getDirectusInstance, { readCollection } from '$lib/directus';

import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance(fetch);
	const photo_slugs = await readCollection(directus, 'photos', { fields: ['slug'] });
	return photo_slugs.map(post => ({ slug: post.slug }));
};

export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	const photos = await readCollection(directus, 'photos', {
		filter: {
			slug: params.slug
		}
	});

	return {
		photo: photos[0]
	};
}
