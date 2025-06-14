<!--
@component
Type definitions for Svelte
-->
<script lang="ts">
	import { onMount } from 'svelte';

	import EnhancedImg from '$lib/components/EnhancedImg.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { DirectusSchema } from '$lib/directus';
	import { imageService } from '$lib/services/ImageService';

	export let data: { photo: DirectusSchema['photos'] };

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
</script>

<SEO
	title={data.photo.title}
	description={(data.photo as { meta_description?: string }).meta_description ||
		`View ${data.photo.title} - Photography by Alex`}
	image={seoImageUrl}
/>

<div class="bg-white">
	<div class="max-w-7xl mx-auto px-8 py-8">
		<div class="flex flex-col items-center justify-center" style="height: calc(100vh - 10rem);">
			<div class="flex-1 flex items-center justify-center w-full">
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
			</div>

			<div class="text-center mt-8">
				<h1 class="text-xl font-light text-gray-900 tracking-wide leading-relaxed">
					{data.photo.title}
				</h1>
			</div>
		</div>
	</div>
</div>
