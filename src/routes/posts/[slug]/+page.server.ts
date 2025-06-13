import { error } from '@sveltejs/kit';

import getDirectusInstance, { readCollection } from '$lib/directus';

import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance(fetch);
	const post_slugs = await readCollection(directus, 'posts', { fields: ['slug'] });
	return post_slugs.map(post => ({ slug: post.slug.trim() }));
};

export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	const [posts, global] = await Promise.all([
		readCollection(directus, 'posts', {
			filter: {
				slug: params.slug
			},
			fields: ['*']
		}),
		readCollection(directus, 'global', { fields: ['author_name'] })
	]);

	if (!posts[0]) {
		throw error(404, 'Post not found');
	}

	return {
		post: posts[0],
		global: global[0]
	};
}
