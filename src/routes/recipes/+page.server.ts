import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	return await loadDirectusItems(fetch, 'recipes');
}
