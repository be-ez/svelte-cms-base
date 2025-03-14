<script lang="ts">
	import { onMount } from 'svelte';

	import manifest from '$lib/image-manifest.json';
	import type { ProcessedImage } from '$lib/image-pipeline';

	export let href = '';
	export let title = undefined;
	export let text = '';
	// Enable downloads by default for markdown content
	export let downloadable = true;

	let imageId = '';
	let processedImage: ProcessedImage | undefined;

	onMount(() => {
		// Extract the image ID from the href
		const url = new URL(href);
		imageId = url.pathname.split('/').pop() || '';
		processedImage = (manifest as Record<string, ProcessedImage>)[imageId];
	});

	// Get paths for all sizes
	$: paths = processedImage
		? {
				thumbnail: {
					webp: `/images/processed/${processedImage.sizes.thumbnail.webp}`,
					jpg: `/images/processed/${processedImage.sizes.thumbnail.jpg}`
				},
				small: {
					webp: `/images/processed/${processedImage.sizes.small.webp}`,
					jpg: `/images/processed/${processedImage.sizes.small.jpg}`
				},
				medium: {
					webp: `/images/processed/${processedImage.sizes.medium.webp}`,
					jpg: `/images/processed/${processedImage.sizes.medium.jpg}`
				},
				large: {
					webp: `/images/processed/${processedImage.sizes.large.webp}`,
					jpg: `/images/processed/${processedImage.sizes.large.jpg}`
				},
				display: {
					webp: `/images/processed/${processedImage.sizes.display.webp}`,
					jpg: `/images/processed/${processedImage.sizes.display.jpg}`
				}
			}
		: null;

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

	// Function to get the original URL
	$: originalUrl = processedImage?.originalPath || href;
</script>

{#if downloadable && processedImage}
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
{:else}
	<picture>
		<source type="image/webp" srcset={srcsetWebp} {sizes} />
		<source type="image/jpeg" srcset={srcsetJpg} {sizes} />
		<img src={paths?.thumbnail.jpg} {title} alt={text} loading="lazy" {sizes} srcset={srcsetJpg} />
	</picture>
{/if}
