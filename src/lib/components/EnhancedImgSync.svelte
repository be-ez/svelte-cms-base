<script lang="ts">
	import type { ImageFormatKey } from '$lib/image-config';
	import type { ImageSizeKey } from '$lib/image-config';
	import type { ProcessedImageData } from '$lib/stores/images';

	// Required props
	export let imageData: ProcessedImageData;
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

	// Generate responsive sizes attribute
	$: responsiveSizes = sizes || imageData.getSizes(defaultSize);

	// Generate srcset for each format
	$: webpSrcSet = imageData.getSrcSet('webp', defaultSize);
	$: jpgSrcSet = imageData.getSrcSet('jpg', defaultSize);

	// Get default/fallback image URL
	$: defaultImageUrl = imageData.getUrl(defaultSize, defaultFormat);
</script>

{#if enableDownload}
	<a
		href={imageData.originalUrl || defaultImageUrl}
		download={downloadName || imageData.id}
		class="enhanced-img-link"
	>
		<picture class={pictureClass}>
			<source type="image/webp" srcset={webpSrcSet} sizes={responsiveSizes} />
			<source type="image/jpeg" srcset={jpgSrcSet} sizes={responsiveSizes} />
			<img
				src={defaultImageUrl}
				{alt}
				{title}
				{loading}
				{fetchpriority}
				{decoding}
				sizes={responsiveSizes}
				srcset={jpgSrcSet}
				class={className}
				{style}
			/>
		</picture>
	</a>
{:else}
	<picture class={pictureClass}>
		<source type="image/webp" srcset={webpSrcSet} sizes={responsiveSizes} />
		<source type="image/jpeg" srcset={jpgSrcSet} sizes={responsiveSizes} />
		<img
			src={defaultImageUrl}
			{alt}
			{title}
			{loading}
			{fetchpriority}
			{decoding}
			sizes={responsiveSizes}
			srcset={jpgSrcSet}
			class={className}
			{style}
		/>
	</picture>
{/if}

<style>
	.enhanced-img-link {
		display: inline-block;
		line-height: 0;
	}
</style>
