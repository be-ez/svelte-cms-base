<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { ImageFormatKey, ImageSizeKey } from '$lib/image-config';
	import { getProcessedImage, type ProcessedImageData } from '$lib/stores/images';
	import {
		createLazyLoader,
		isIntersectionObserverSupported
	} from '$lib/utils/intersectionObserver';

	import ImagePlaceholder from './ImagePlaceholder.svelte';

	// Required props
	export let imageId: string;
	export let alt: string;

	// Optional props
	export let title: string | undefined = undefined;
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let fetchpriority: 'high' | 'low' | 'auto' = 'auto';
	export let decoding: 'async' | 'sync' | 'auto' = 'async';
	export let defaultSize: ImageSizeKey = 'display';
	export let defaultFormat: ImageFormatKey = 'webp';
	export let className: string = '';
	export let style: string = '';

	// Advanced options
	export let sizes: string | undefined = undefined;
	export let pictureClass: string = '';
	export let enableDownload = false;
	export let downloadName: string | undefined = undefined;
	export let onLoad: ((event: Event) => void) | undefined = undefined;

	// Intersection Observer options
	export let enableIntersectionObserver = true;
	export let rootMargin = '50px';
	export let threshold = 0.1;

	// State
	let imageData: ProcessedImageData | null = null;
	let isLoadingMetadata = true;
	let hasError = false;
	let isInViewport = false;
	let imgElement: HTMLImageElement;
	let containerElement: HTMLElement;

	// Loading state for blur-up effect
	let isImageLoaded = false;

	// Lazy loader
	let lazyLoader: ReturnType<typeof createLazyLoader> | null = null;

	onMount(async () => {
		try {
			imageData = await getProcessedImage(imageId);
			isLoadingMetadata = false;

			if (!imageData) {
				// In development, this is expected - fallback to direct asset URL
				if (import.meta.env.DEV) {
					console.info(`Image ${imageId} not processed yet - using direct asset URL`);
				} else {
					console.warn(`No processed image found for ID: ${imageId}`);
				}
				hasError = true;
				return;
			}

			// Set up intersection observer if enabled and supported
			if (enableIntersectionObserver && isIntersectionObserverSupported() && loading === 'lazy') {
				setupIntersectionObserver();
			} else {
				// Load immediately if not using lazy loading or not supported
				isInViewport = true;
			}
		} catch (error) {
			console.error(`Error loading image ${imageId}:`, error);
			hasError = true;
			isLoadingMetadata = false;
		}
	});

	onDestroy(() => {
		lazyLoader?.disconnect();
	});

	function setupIntersectionObserver() {
		lazyLoader = createLazyLoader({
			rootMargin,
			threshold,
			once: true,
			onEnter: () => {
				isInViewport = true;
			}
		});

		if (containerElement) {
			lazyLoader.observe(containerElement);
		}
	}

	// Generate responsive sizes attribute
	$: responsiveSizes = sizes || imageData?.getSizes() || '';

	// Generate srcset for each format
	$: webpSrcSet = imageData?.getSrcSet('webp') || '';
	$: jpgSrcSet = imageData?.getSrcSet('jpg') || '';

	// Get default/fallback image URL
	$: defaultImageUrl = imageData?.getUrl(defaultSize, defaultFormat) || `/assets/${imageId}`;

	// Handle image load event
	function handleImageLoad(event: Event) {
		isImageLoaded = true;
		onLoad?.(event);
	}

	// Handle image error
	function handleImageError() {
		hasError = true;
		console.error(`Failed to load image: ${imageId}`);
	}
</script>

<span bind:this={containerElement} class="enhanced-img-container" {style}>
	{#if isLoadingMetadata}
		<!-- Loading metadata - show basic placeholder -->
		<ImagePlaceholder aspectRatio={1.33} className="enhanced-img-placeholder" />
	{:else if hasError}
		<span class="enhanced-img-error">
			<span>Failed to load image</span>
		</span>
	{:else if imageData && isInViewport}
		{#if enableDownload}
			<a
				href={imageData.originalUrl || defaultImageUrl}
				download={downloadName || imageId}
				class="enhanced-img-link"
			>
				<picture class={pictureClass}>
					<source type="image/webp" srcset={webpSrcSet} sizes={responsiveSizes} />
					<source type="image/jpeg" srcset={jpgSrcSet} sizes={responsiveSizes} />
					<img
						bind:this={imgElement}
						src={defaultImageUrl}
						{alt}
						{title}
						loading="eager"
						{fetchpriority}
						{decoding}
						sizes={responsiveSizes}
						srcset={jpgSrcSet}
						class="enhanced-img {className}"
						class:loaded={isImageLoaded}
						on:load={handleImageLoad}
						on:error={handleImageError}
					/>
				</picture>
			</a>
		{:else}
			<picture class={pictureClass}>
				<source type="image/webp" srcset={webpSrcSet} sizes={responsiveSizes} />
				<source type="image/jpeg" srcset={jpgSrcSet} sizes={responsiveSizes} />
				<img
					bind:this={imgElement}
					src={defaultImageUrl}
					{alt}
					{title}
					loading="eager"
					{fetchpriority}
					{decoding}
					sizes={responsiveSizes}
					srcset={jpgSrcSet}
					class="enhanced-img {className}"
					class:loaded={isImageLoaded}
					on:load={handleImageLoad}
					on:error={handleImageError}
				/>
			</picture>
		{/if}
	{:else if imageData}
		<!-- Placeholder while waiting for intersection - now has correct aspect ratio -->
		<ImagePlaceholder
			aspectRatio={imageData.metadata.aspectRatio}
			className="enhanced-img-placeholder"
			animated={false}
		/>
	{:else}
		<!-- Fallback to original asset if no processed image available -->
		<img
			src="/assets/{imageId}"
			{alt}
			{title}
			{loading}
			class="enhanced-img"
			on:error={handleImageError}
		/>
	{/if}
</span>

<style>
	.enhanced-img-container {
		position: relative;
		display: inline-block;
	}

	.enhanced-img-error {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		color: #666;
		font-size: 0.875rem;
		padding: 2rem;
		text-align: center;
		min-height: 200px;
	}

	.enhanced-img-link {
		display: block;
		line-height: 0;
	}

	.enhanced-img {
		transition: opacity 0.3s ease-in-out;
	}

	.enhanced-img:not(.loaded) {
		opacity: 0;
	}

	.enhanced-img.loaded {
		opacity: 1;
	}

	picture {
		display: block;
		line-height: 0;
	}
</style>
