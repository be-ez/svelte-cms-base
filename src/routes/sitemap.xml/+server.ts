import { loadDirectusItems } from '$lib/utils/loadDirectusItems';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ setHeaders, fetch }) => {
	try {
		// Load all content from Directus including global settings
		const [postsData, photosData, recipesData, globalData] = await Promise.all([
			loadDirectusItems(fetch, 'posts', { fields: ['slug', 'date_updated'] }),
			loadDirectusItems(fetch, 'photos', { fields: ['slug', 'date_updated'] }),
			loadDirectusItems(fetch, 'recipes', { fields: ['slug', 'date_updated'] }),
			loadDirectusItems(fetch, 'global', { fields: ['site_url'] })
		]);

		const posts = postsData.posts || [];
		const photos = photosData.photos || [];
		const recipes = recipesData.recipes || [];
		const baseUrl = globalData.global?.[0]?.site_url;

		// Static pages
		const staticPages = [
			{ url: '/', lastmod: new Date().toISOString(), priority: '1.0' },
			{ url: '/about', lastmod: new Date().toISOString(), priority: '0.8' },
			{ url: '/posts', lastmod: new Date().toISOString(), priority: '0.9' },
			{ url: '/photos', lastmod: new Date().toISOString(), priority: '0.8' },
			{ url: '/recipes', lastmod: new Date().toISOString(), priority: '0.7' }
		];

		// Dynamic pages
		const dynamicPages = [
			...(posts as any[]).map((post: any) => ({
				url: `/posts/${post.slug}`,
				lastmod: post.date_updated || new Date().toISOString(),
				priority: '0.8'
			})),
			...(photos as any[]).map((photo: any) => ({
				url: `/photos/${photo.slug}`,
				lastmod: photo.date_updated || new Date().toISOString(),
				priority: '0.7'
			})),
			...(recipes as any[]).map((recipe: any) => ({
				url: `/recipes/${recipe.slug}`,
				lastmod: recipe.date_updated || new Date().toISOString(),
				priority: '0.6'
			}))
		];

		const allPages = [...staticPages, ...dynamicPages];

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

		setHeaders({
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600' // Cache for 1 hour
		});

		return new Response(sitemap);
	} catch (error) {
		console.error('Error generating sitemap:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}
};
