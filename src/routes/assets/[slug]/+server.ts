export const prerender = true;

import { readFiles } from '@directus/sdk';

import { DIRECTUS_API_URL, DIRECTUS_TOKEN } from '$env/static/private';
import getDirectusInstance from '$lib/directus';

import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	const directus = getDirectusInstance(fetch);
	const file_ids = await directus.request(readFiles({ fields: ['id'] }));
	return file_ids.map(file => ({ slug: file.id }));
};

export async function GET({ params }) {
	const { slug } = params;
	return fetch(`${DIRECTUS_API_URL}/assets/${slug}`, {
		headers: {
			Authorization: `Bearer ${DIRECTUS_TOKEN}`
		}
	});
}
