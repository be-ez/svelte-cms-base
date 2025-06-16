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

	onMount(() => {
		// Load photos immediately to prevent layout shift
		shouldLoadPhotos = true;
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
		<!-- Static placeholder to prevent layout shift -->
		<div class="photo-grid-placeholder">
			<div class="placeholder-grid">
				{#each Array(6) as _, i (i)}
					<div class="placeholder-item"></div>
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

	.placeholder-grid {
		column-count: 2;
		column-gap: 1rem;
		column-fill: balance;
	}

	.placeholder-item {
		background: #f0f0f0;
		aspect-ratio: 1/1.4; /* Typical photo ratio */
		width: 100%;
		margin-bottom: 1rem;
		break-inside: avoid;
		display: inline-block;
		border-radius: 4px;
	}

	@media (min-width: 768px) {
		.photo-grid-placeholder {
			padding: 1.5rem;
		}
	}

	@media (min-width: 1025px) {
		.placeholder-grid {
			column-count: 3;
			column-gap: 1.5rem;
		}

		.placeholder-item {
			margin-bottom: 1.5rem;
		}
	}
</style>
