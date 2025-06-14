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

	// Get all photos sorted by date for navigation
	const allPhotos = await readCollection(directus, 'photos', {
		fields: ['slug', 'title', 'date_created'],
		sort: ['-date_created']
	});

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

	// Find current photo index and get prev/next
	const currentIndex = allPhotos.findIndex(p => p.slug.trim() === params.slug);
	const prevPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;
	const nextPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;

	return {
		photo: photos[0],
		prevPhoto,
		nextPhoto
	};
}
