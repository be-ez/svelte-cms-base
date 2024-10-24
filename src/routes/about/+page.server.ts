/** @type {import('./$types').PageLoad} */
import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

export const load = async ({ fetch }) => {
	return await loadDirectusItems(fetch, 'secret_files', {
		fields: ['*, files.directus_files_id.id, files.directus_files_id.filename_download']
	});
};
