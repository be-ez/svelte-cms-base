<script lang="ts">
	import { onMount, tick } from 'svelte';

	import SEO from '$lib/components/SEO.svelte';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PhotoGrid from '../../components/utils/PhotoGrid.svelte';

	interface Photo {
		slug: string;
		title: string;
		image: string;
	}

	interface PageData {
		photos: Photo[];
	}

	export let data: PageData;
	let isPinterestStyle = true; // Use masonry layout for Pinterest-style grid
	let shouldLoadPhotos = false;

	// Transform photos to grid items
	$: gridItems = data.photos.map(photo => ({
		slug: photo.slug.trim(),
		title: photo.title,
		imageId: photo.image,
		baseUrl: '/photos'
	}));

	onMount(async () => {
		// Wait for next tick to ensure layout is rendered
		await tick();
		// Small delay to let navbar fully render
		setTimeout(() => {
			shouldLoadPhotos = true;
		}, 50);
	});
</script>

<SEO
	title="Photos"
	description="Browse my photography collection featuring nature, travel, and street photography"
/>

<DefaultPage title="Photos">
	{#if shouldLoadPhotos}
		<PhotoGrid
			items={gridItems}
			loading={false}
			error={null}
			itemType="photo"
			{isPinterestStyle}
			eagerLoadCount={6}
			priorityLoadCount={3}
		/>
	{:else}
		<!-- Loading placeholder that doesn't block layout -->
		<div class="photo-grid-placeholder">
			<div class="animate-pulse grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
				{#each Array(6) as _, i (i)}
					<div class="bg-gray-200 aspect-square rounded"></div>
				{/each}
			</div>
		</div>
	{/if}
</DefaultPage>

<style>
	.photo-grid-placeholder {
		min-height: 60vh;
		padding: 1rem;
	}

	@media (min-width: 768px) {
		.photo-grid-placeholder {
			padding: 1.5rem;
		}
	}
</style>
