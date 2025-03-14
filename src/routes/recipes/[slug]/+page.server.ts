import getDirectusInstance, { readCollection } from '$lib/directus';

import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance();
	const recipe_slugs = await readCollection(directus, 'recipes', { fields: ['slug'] });
	return recipe_slugs.map(recipe => ({ slug: recipe.slug }));
};

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
