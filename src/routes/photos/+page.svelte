<script lang="ts">
	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import { onMount } from 'svelte';
	import { getProcessedImagePath } from '$lib/images';

	interface Photo {
		slug: string;
		title: string;
		image: string;
	}

	interface ProcessedPhoto extends Photo {
		processedPath: string;
	}

	interface PageData {
		photos: Photo[];
	}

	export let data: PageData;
	let isPinterestStyle = true;
	let loading = true;
	let error: Error | null = null;
	let processedPhotos: ProcessedPhoto[] = [];

	onMount(async () => {
		try {
			const processed = await Promise.all(
				data.photos.map(async (photo) => ({
					...photo,
					processedPath: await getProcessedImagePath(photo.image, 'thumbnail')
				}))
			);
			processedPhotos = processed;
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to load images');
		} finally {
			loading = false;
		}
	});
</script>

<DefaultPage title="Photos">
	<div class="m-0 p-0">
		<label class="m-0 p-0 inline-block">
			<input type="checkbox" bind:checked={isPinterestStyle} />
			Toggle Pinterest Style
		</label>

		{#if loading}
			<div>Loading images...</div>
		{:else if error}
			<div>Error loading images: {error.message}</div>
		{:else}
			<div class="photo-grid m-0 p-0" class:is-pinterest={isPinterestStyle}>
				{#each processedPhotos as photo}
					<div class="photo-item m-0 p-0">
						<a
							href={photo ? `/photos/${encodeURIComponent(photo.slug)}` : ''}
							class="block m-0 p-0"
						>
							<img
								src={photo.processedPath}
								alt={photo.title}
								loading="lazy"
								decoding="async"
								class="block m-0 p-0"
							/>
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</DefaultPage>

<style>
	.photo-grid {
		width: 100%;
		gap: 0;
		line-height: 0;
	}

	.photo-grid:not(.is-pinterest) {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}

	.photo-grid.is-pinterest {
		column-count: 3;
		column-gap: 0;
		column-fill: balance;
	}

	.photo-item {
		width: 100%;
		height: auto;
		display: block;
		line-height: 0;
	}

	.photo-grid:not(.is-pinterest) .photo-item {
		margin: 0;
		padding: 0;
	}

	.photo-grid.is-pinterest .photo-item {
		break-inside: avoid;
		display: inline-block;
		margin: 0;
		padding: 0;
		line-height: 0;
	}

	.photo-item img {
		width: 100%;
		height: auto;
		object-fit: cover;
		display: block;
		margin: 0;
		padding: 0;
		vertical-align: bottom;
	}

	.photo-grid:not(.is-pinterest) .photo-item img {
		aspect-ratio: 1 / 1;
	}

	label {
		display: inline-block;
		margin: 0;
		padding: 0;
	}

	@media (min-width: 1025px) {
		.photo-grid {
			gap: 1rem;
		}

		.photo-grid.is-pinterest {
			column-gap: 1rem;
		}

		.photo-grid.is-pinterest .photo-item {
			margin-bottom: 1rem;
		}
	}

	@media (max-width: 1024px) {
		.photo-grid:not(.is-pinterest) {
			grid-template-columns: repeat(3, 1fr);
		}
		.photo-grid.is-pinterest {
			column-count: 2;
		}
	}

	@media (max-width: 640px) {
		.photo-grid:not(.is-pinterest) {
			grid-template-columns: repeat(2, 1fr);
		}
		.photo-grid.is-pinterest {
			column-count: 2;
		}
	}
</style>
