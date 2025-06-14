/** @type {import('./$types').PageLoad} */
import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

export const load = async ({ fetch }) => {
	const secretFiles = await loadDirectusItems(fetch, 'secret_files', {
		fields: ['*, files.directus_files_id.id, files.directus_files_id.filename_download']
	});

	// Try to load about data, fallback if permissions not set up yet
	let aboutData;
	try {
		aboutData = await loadDirectusItems(fetch, 'about', {
			fields: ['content', 'meta_description']
		});
	} catch (error) {
		console.error('Error loading about collection:', error);
		console.warn('About collection not accessible, using fallback');
		aboutData = { about: [] };
	}
	return {
		secret_files: secretFiles.secret_files,
		about: aboutData.about || { content: '', meta_description: '' }
	};
};
