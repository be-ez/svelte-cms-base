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

	onMount(async () => {
		// Get SEO image URL for meta tags
		seoImageUrl = await imageService.getImageUrl(data.photo.image, 'display');
		_loading = false;
	});
</script>

<SEO
	title={data.photo.title}
	description={(data.photo as { meta_description?: string }).meta_description ||
		`View ${data.photo.title} - Photography by Alex`}
	image={seoImageUrl}
/>

<div class="min-h-[calc(100vh-8rem)] flex flex-col">
	<h1 class="p-4 text-center">{data.photo.title}</h1>

	<div class="flex-1 flex flex-col items-center justify-center p-4 gap-4">
		<EnhancedImg
			imageId={data.photo.image}
			alt={data.photo.title}
			className="max-w-full max-h-[calc(100vh-12rem)] object-contain"
			enableDownload={true}
			downloadName={data.photo.title}
			eager={true}
			priority={true}
		/>
	</div>
</div>
