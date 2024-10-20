/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/directus';
import { readItems } from '@directus/sdk';


export async function load({ fetch, params }) {
    const directus = getDirectusInstance(fetch);
    const photos = await directus.request(readItems('photos', {
        filter: {
            slug: params.slug
        }
    }));

    return {
        photo: photos[0]
    };
}