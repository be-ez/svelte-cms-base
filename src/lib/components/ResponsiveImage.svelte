<script lang="ts">
	import { onMount } from 'svelte';

	import { getProcessedImage, type ProcessedImageData } from '$lib/stores/images';

	import EnhancedImg from './EnhancedImg.svelte';
	import EnhancedImgSync from './EnhancedImgSync.svelte';

	// Simple API - just image ID and alt text required
	export let src: string; // Image ID
	export let alt: string;

	// Optional
	export let title: string | undefined = undefined;
	export let className: string = '';
	export let eager = false; // If true, loads immediately
	export let priority = false; // If true, sets high priority
	export let aspectRatio: string | undefined = undefined; // e.g., "16/9", "1/1"
	export let objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
	export let width: string | undefined = undefined;
	export let height: string | undefined = undefined;

	// For SSR optimization - if you already have the image data
	export let preloadedImageData: ProcessedImageData | undefined = undefined;

	// Intersection observer settings for gallery optimization
	export let rootMargin = '100px'; // Load images 100px before they enter viewport
	export let threshold = 0.1;

	// Internal state
	let imageData: ProcessedImageData | null = preloadedImageData || null;
	let isClient = false;

	onMount(() => {
		isClient = true;
		if (!preloadedImageData) {
			loadImageData();
		}
	});

	async function loadImageData() {
		imageData = await getProcessedImage(src);
	}

	// Build style string
	$: styleString = [
		aspectRatio ? `aspect-ratio: ${aspectRatio}` : '',
		`object-fit: ${objectFit}`,
		width ? `width: ${width}` : '',
		height ? `height: ${height}` : ''
	]
		.filter(Boolean)
		.join('; ');
</script>

{#if imageData}
	<EnhancedImgSync
		{imageData}
		{alt}
		{title}
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : 'auto'}
		{className}
		style={styleString}
	/>
{:else if isClient}
	<EnhancedImg
		imageId={src}
		{alt}
		{title}
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : 'auto'}
		{className}
		style={styleString}
		{rootMargin}
		{threshold}
	/>
{:else}
	<!-- SSR fallback -->
	<img
		src="/assets/{src}"
		{alt}
		{title}
		loading={eager ? 'eager' : 'lazy'}
		class={className}
		style={styleString}
	/>
{/if}
