/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';


export async function load({ fetch, params }) {
    const directus = getDirectusInstance(fetch);
    const recipes = await directus.request(readItems('recipes', {
        filter: {
            slug: params.slug
        }
    }));

    return {
        recipe: recipes[0]
    };
}