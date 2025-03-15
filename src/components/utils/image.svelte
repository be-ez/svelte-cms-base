<script lang="ts">
	import { onMount } from 'svelte';

	import type { ProcessedImage } from '$lib/image-pipeline';
	import { getProcessedImagePath } from '$lib/images';

	export let href = '';
	export let title = undefined;
	export let text = '';
	// Enable downloads by default for markdown content
	export let downloadable = true;

	let imageId = '';
	let paths: {
		thumbnail: { webp: string; jpg: string };
		small: { webp: string; jpg: string };
		medium: { webp: string; jpg: string };
		large: { webp: string; jpg: string };
		display: { webp: string; jpg: string };
	} | null = null;
	let originalUrl = href;

	onMount(async () => {
		// Extract the image ID from the href
		const url = new URL(href);
		imageId = url.pathname.split('/').pop() || '';

		if (imageId) {
			// Get paths for all sizes
			paths = {
				thumbnail: {
					webp: await getProcessedImagePath(imageId, 'thumbnail', 'webp'),
					jpg: await getProcessedImagePath(imageId, 'thumbnail', 'jpg')
				},
				small: {
					webp: await getProcessedImagePath(imageId, 'small', 'webp'),
					jpg: await getProcessedImagePath(imageId, 'small', 'jpg')
				},
				medium: {
					webp: await getProcessedImagePath(imageId, 'medium', 'webp'),
					jpg: await getProcessedImagePath(imageId, 'medium', 'jpg')
				},
				large: {
					webp: await getProcessedImagePath(imageId, 'large', 'webp'),
					jpg: await getProcessedImagePath(imageId, 'large', 'jpg')
				},
				display: {
					webp: await getProcessedImagePath(imageId, 'display', 'webp'),
					jpg: await getProcessedImagePath(imageId, 'display', 'jpg')
				}
			};

			// If the paths point to the original asset, use the href as the original URL
			if (paths.display.webp.startsWith('/assets/')) {
				originalUrl = href;
			} else {
				// Otherwise, use the original size path
				originalUrl = await getProcessedImagePath(imageId, 'original', 'webp');
			}
		}
	});

	// Create srcset strings for each format
	$: srcsetWebp = paths
		? `${paths.thumbnail.webp} 400w, 
           ${paths.small.webp} 800w, 
           ${paths.medium.webp} 1200w, 
           ${paths.large.webp} 1800w, 
           ${paths.display.webp} 2400w`
		: '';

	$: srcsetJpg = paths
		? `${paths.thumbnail.jpg} 400w, 
           ${paths.small.jpg} 800w, 
           ${paths.medium.jpg} 1200w, 
           ${paths.large.jpg} 1800w, 
           ${paths.display.jpg} 2400w`
		: '';

	// Define sizes attribute for responsive images
	const sizes =
		'(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, (max-width: 1800px) 1800px, 2400px';
</script>

{#if downloadable && paths}
	<a href={originalUrl} download class="block hover:opacity-90 transition-opacity">
		<picture>
			<source type="image/webp" srcset={srcsetWebp} {sizes} />
			<source type="image/jpeg" srcset={srcsetJpg} {sizes} />
			<img
				src={paths?.thumbnail.jpg}
				{title}
				alt={text}
				loading="lazy"
				{sizes}
				srcset={srcsetJpg}
				class="cursor-pointer"
			/>
		</picture>
	</a>
{:else if paths}
	<picture>
		<source type="image/webp" srcset={srcsetWebp} {sizes} />
		<source type="image/jpeg" srcset={srcsetJpg} {sizes} />
		<img src={paths?.thumbnail.jpg} {title} alt={text} loading="lazy" {sizes} srcset={srcsetJpg} />
	</picture>
{:else}
	<img src={href} {title} alt={text} loading="lazy" />
{/if}
