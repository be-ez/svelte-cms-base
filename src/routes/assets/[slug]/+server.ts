export const prerender = true;

import { DIRECTUS_TOKEN, DIRECTUS_API_URL } from '$env/static/private';

export async function GET({ params }) {
  const { slug } = params;
  return fetch(`${DIRECTUS_API_URL}/assets/${slug}`, {
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`
    }
  })
}