export const prerender = true;

import type { EntryGenerator } from './$types';
import getDirectusInstance from '$lib/directus';
import { readFiles } from '@directus/sdk';

import { DIRECTUS_TOKEN, DIRECTUS_API_URL } from '$env/static/private';

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance(fetch);
	const file_ids = await directus.request(readFiles({ fields: ['id'] }));
	return file_ids.map((file) => ({ slug: file.id }));
};

export async function GET({ params }) {
	const { slug } = params;
	return fetch(`${DIRECTUS_API_URL}/assets/${slug}`, {
		headers: {
			Authorization: `Bearer ${DIRECTUS_TOKEN}`
		}
	});
}
