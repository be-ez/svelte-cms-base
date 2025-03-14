<!--
@component
Type definitions for Svelte
-->
<script lang="ts">
	import { onMount } from 'svelte';

	import type { DirectusSchema } from '$lib/directus';
	import { getProcessedImagePath } from '$lib/images';

	export let data: { photo: DirectusSchema['photos'] };

	let displayPath = '';
	let downloadPath = '';
	let loading = true;
	let error: Error | null = null;

	onMount(async () => {
		try {
			const [display, download] = await Promise.all([
				getProcessedImagePath(data.photo.image, 'display'),
				getProcessedImagePath(data.photo.image, 'original')
			]);
			displayPath = display;
			downloadPath = download;
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to load image');
		} finally {
			loading = false;
		}
	});
</script>

<div class="min-h-[calc(100vh-8rem)] flex flex-col">
	<h1 class="p-4 text-center">{data.photo.title}</h1>

	{#if loading}
		<div class="flex-1 flex items-center justify-center">Loading image...</div>
	{:else if error}
		<div class="flex-1 flex items-center justify-center">Error loading image: {error.message}</div>
	{:else}
		<div class="flex-1 flex flex-col items-center justify-center p-4 gap-4">
			<img
				src={displayPath}
				alt={data.photo.title}
				class="max-w-full max-h-[calc(100vh-12rem)] object-contain"
			/>
			<a
				href={downloadPath}
				download
				class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
			>
				Download Original
			</a>
		</div>
	{/if}
</div>
