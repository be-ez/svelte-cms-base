export const prerender = true;

/** @type {import('./$types').PageLoad} */
import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

export async function load({ fetch }) {
	return await loadDirectusItems(fetch, 'posts');
}
