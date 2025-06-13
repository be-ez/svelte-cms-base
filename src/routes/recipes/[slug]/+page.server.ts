import { error } from '@sveltejs/kit';

import getDirectusInstance, { readCollection } from '$lib/directus';

import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance();
	const recipe_slugs = await readCollection(directus, 'recipes', { fields: ['slug'] });
	return recipe_slugs.map(recipe => ({ slug: recipe.slug.trim() }));
};

export async function load({ fetch, params }) {
	const directus = getDirectusInstance(fetch);
	const recipes = await readCollection(directus, 'recipes', {
		filter: {
			slug: params.slug
		}
	});

	if (!recipes[0]) {
		throw error(404, 'Recipe not found');
	}

	return {
		recipe: recipes[0]
	};
}
