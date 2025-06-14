<!--
@component
Type definitions for Svelte
-->
<script lang="ts">
	import { onMount } from 'svelte';

	import { goto, invalidateAll } from '$app/navigation';
	import EnhancedImg from '$lib/components/EnhancedImg.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { DirectusSchema } from '$lib/directus';
	import { imageService } from '$lib/services/ImageService';

	export let data: {
		photo: DirectusSchema['photos'];
		prevPhoto: { slug: string; title: string } | null;
		nextPhoto: { slug: string; title: string } | null;
	};

	let seoImageUrl = '';
	let _loading = true;
	let imageElement: HTMLImageElement;
	let isLandscape = false;

	onMount(async () => {
		// Get SEO image URL for meta tags
		seoImageUrl = await imageService.getImageUrl(data.photo.image, 'display');
		_loading = false;
	});

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		isLandscape = img.naturalWidth > img.naturalHeight;
	}

	async function navigateToPhoto(slug: string) {
		await goto(`/photos/${slug}`);
		await invalidateAll();
	}
</script>

<SEO
	title={data.photo.title}
	description={(data.photo as { meta_description?: string }).meta_description ||
		`View ${data.photo.title} - Photography by Alex`}
	image={seoImageUrl}
/>

<div class="bg-white">
	<div class="max-w-7xl mx-auto px-8 py-8">
		<div
			class="flex flex-col items-center justify-center relative"
			style="height: calc(100vh - 10rem);"
		>
			<!-- Left navigation area - extended toward center -->
			{#if data.prevPhoto}
				<button
					on:click={() => navigateToPhoto(data.prevPhoto.slug)}
					class="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-start pl-8 group cursor-pointer"
					aria-label="Previous photo: {data.prevPhoto.title}"
				>
					<div
						class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm rounded-full p-3"
					>
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</div>
				</button>
			{/if}

			<!-- Right navigation area - extended toward center -->
			{#if data.nextPhoto}
				<button
					on:click={() => navigateToPhoto(data.nextPhoto.slug)}
					class="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-end pr-8 group cursor-pointer"
					aria-label="Next photo: {data.nextPhoto.title}"
				>
					<div
						class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm rounded-full p-3"
					>
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</button>
			{/if}

			<div class="flex-1 flex items-center justify-center w-full relative">
				{#key data.photo.image}
					<EnhancedImg
						imageId={data.photo.image}
						alt={data.photo.title}
						className="max-w-[85vw] max-h-[calc(100vh-14rem)] object-contain shadow-2xl"
						enableDownload={true}
						downloadName={data.photo.title}
						loading="eager"
						fetchpriority="high"
						onLoad={handleImageLoad}
					/>
				{/key}
			</div>

			<div class="text-center mt-8">
				<h1 class="text-xl font-light text-gray-900 tracking-wide leading-relaxed">
					{data.photo.title}
				</h1>
			</div>
		</div>
	</div>
</div>
