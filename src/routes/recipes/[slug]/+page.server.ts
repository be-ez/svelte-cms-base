import getDirectusInstance, { readCollection } from '$lib/directus';

export const prerender = true;

export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	const recipes = await readCollection(directus, 'recipes', {
		filter: {
			slug: params.slug
		}
	});

	return {
		recipe: recipes[0]
	};
}
