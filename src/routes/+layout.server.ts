import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

export async function load({ fetch }) {
	try {
		const globalData = await loadDirectusItems(fetch, 'global');
		return {
			global: globalData.global
		};
	} catch (error) {
		console.error('Error loading global data:', error);
		return {
			global: null
		};
	}
}
