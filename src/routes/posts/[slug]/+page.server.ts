import getDirectusInstance, { readCollection } from '$lib/directus';

import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance(fetch);
	const post_slugs = await readCollection(directus, 'posts', { fields: ['slug'] });
	return post_slugs.map(post => ({ slug: post.slug }));
};

export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	const posts = await readCollection(directus, 'posts', {
		filter: {
			slug: params.slug
		}
	});

	return {
		post: posts[0]
	};
}
