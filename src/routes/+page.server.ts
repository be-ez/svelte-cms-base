/** @type {import('./$types').PageLoad} */
import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

export async function load({ fetch }) {
	try {
		const globalData = await loadDirectusItems(fetch, 'global');
		const { global } = globalData;
		return {
			global: global
		};
	} catch (error) {
		console.error('Error loading global data:', error);
		return {
			global: null // Return null if there's an error
		};
	}
}
