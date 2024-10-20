import { createDirectus, rest, staticToken } from '@directus/sdk';
import { readItems, readItem, updateItem, updateUser, createItem, deleteItem } from '@directus/sdk';
import { DIRECTUS_TOKEN, DIRECTUS_API_URL } from '$env/static/private';

function getDirectusInstance(fetch: any) {
    const options = fetch ? { globals: { fetch } } : {};
    const directus = createDirectus(DIRECTUS_API_URL, options).with(staticToken(DIRECTUS_TOKEN)).with(rest());
    return directus;
}

export default getDirectusInstance;