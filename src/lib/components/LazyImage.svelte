<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { ImageFormatKey, ImageSizeKey } from '$lib/image-config';
	import { getProcessedImage, type ProcessedImageData } from '$lib/stores/images';
	import {
		createLazyLoader,
		isIntersectionObserverSupported
	} from '$lib/utils/intersectionObserver';

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

	// Lazy loading options
	export let enableBlurUp = true;
	export let blurSize: ImageSizeKey = 'thumbnail';
	export let rootMargin = '50px';
	export let threshold = 0.1;
	export let enableIntersectionObserver = true;

	// Advanced options
	export let sizes: string | undefined = undefined;
	export let pictureClass: string = '';
	export let enableDownload = false;
	export let downloadName: string | undefined = undefined;

	// State
	let imageData: ProcessedImageData | null = null;
	let isImageDataLoaded = false;
	let isInViewport = false;
	let isImageLoaded = false;
	let hasError = false;
	let imgElement: HTMLImageElement;
	let containerElement: HTMLElement;

	// Blur-up state
	let blurImageUrl = '';
	let mainImageUrl = '';

	// Lazy loader
	let lazyLoader: ReturnType<typeof createLazyLoader> | null = null;

	onMount(async () => {
		// Load image data
		try {
			imageData = await getProcessedImage(imageId);
			if (!imageData) {
				console.warn(`No processed image found for ID: ${imageId}`);
				hasError = true;
				return;
			}
			isImageDataLoaded = true;

			// Set up URLs
			blurImageUrl = imageData.getUrl(blurSize, 'jpg');
			mainImageUrl = imageData.getUrl(defaultSize, defaultFormat);

			// Set up intersection observer if enabled and supported
			if (enableIntersectionObserver && isIntersectionObserverSupported() && loading === 'lazy') {
				setupIntersectionObserver();
			} else {
				// Load immediately if not using lazy loading
				isInViewport = true;
			}
		} catch (error) {
			console.error(`Error loading image ${imageId}:`, error);
			hasError = true;
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

	// Handle main image load
	function handleMainImageLoad() {
		isImageLoaded = true;
	}

	// Handle image error
	function handleImageError() {
		hasError = true;
		console.error(`Failed to load image: ${imageId}`);
	}

	// Should show blur placeholder
	$: showBlurPlaceholder = enableBlurUp && !isImageLoaded && isInViewport && !hasError;

	// Should show main image
	$: showMainImage = isInViewport && !hasError;
</script>

<div bind:this={containerElement} class="lazy-image-container {className}" {style}>
	{#if !isImageDataLoaded}
		<!-- Loading skeleton -->
		<div class="loading-skeleton"></div>
	{:else if hasError}
		<!-- Error state -->
		<div class="error-placeholder">
			<span>Failed to load image</span>
		</div>
	{:else}
		<div class="image-wrapper">
			{#if showBlurPlaceholder}
				<!-- Blur-up placeholder -->
				<img
					src={blurImageUrl}
					{alt}
					{title}
					class="blur-placeholder"
					loading="eager"
					decoding="sync"
				/>
			{/if}

			{#if showMainImage}
				{#if enableDownload}
					<a
						href={imageData?.originalUrl || mainImageUrl}
						download={downloadName || imageId}
						class="download-link"
					>
						<picture class={pictureClass}>
							<source type="image/webp" srcset={webpSrcSet} sizes={responsiveSizes} />
							<source type="image/jpeg" srcset={jpgSrcSet} sizes={responsiveSizes} />
							<img
								bind:this={imgElement}
								src={mainImageUrl}
								{alt}
								{title}
								{loading}
								{fetchpriority}
								{decoding}
								sizes={responsiveSizes}
								srcset={jpgSrcSet}
								class="main-image"
								class:loaded={isImageLoaded}
								on:load={handleMainImageLoad}
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
							src={mainImageUrl}
							{alt}
							{title}
							{loading}
							{fetchpriority}
							{decoding}
							sizes={responsiveSizes}
							srcset={jpgSrcSet}
							class="main-image"
							class:loaded={isImageLoaded}
							on:load={handleMainImageLoad}
							on:error={handleImageError}
						/>
					</picture>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.lazy-image-container {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}

	.loading-skeleton {
		width: 100%;
		height: 200px; /* Default height, should be overridden by container */
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.error-placeholder {
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

	.image-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.blur-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(10px);
		transform: scale(1.1); /* Slightly larger to hide blur edges */
		z-index: 1;
	}

	.main-image {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		z-index: 2;
	}

	.main-image.loaded {
		opacity: 1;
	}

	.download-link {
		display: block;
		line-height: 0;
	}

	/* Ensure images fill their containers properly */
	picture {
		display: block;
		width: 100%;
		height: 100%;
	}

	picture img {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
