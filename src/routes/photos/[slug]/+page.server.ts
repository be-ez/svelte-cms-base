import { error } from '@sveltejs/kit';

import getDirectusInstance, { readCollection } from '$lib/directus';

import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance(fetch);
	const photo_slugs = await readCollection(directus, 'photos', { fields: ['slug'] });
	return photo_slugs.map(post => ({ slug: post.slug.trim() }));
};

export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	// First try exact match
	let photos = await readCollection(directus, 'photos', {
		filter: {
			slug: params.slug
		},
		fields: ['*']
	});

	// If not found, try with trimmed slug (in case DB has trailing spaces)
	if (!photos[0]) {
		photos = await readCollection(directus, 'photos', {
			filter: {
				slug: params.slug + ' '
			},
			fields: ['*']
		});
	}

	if (!photos[0]) {
		throw error(404, 'Photo not found');
	}

	return {
		photo: photos[0]
	};
}
