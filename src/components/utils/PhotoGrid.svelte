<script lang="ts">
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

	export let items: {
		slug: string;
		title: string;
		processedPath?: string; // Keep for backwards compatibility
		imageId?: string; // New field for image ID
		baseUrl: string;
	}[] = [];
	export let loading = false;
	export let error: Error | null = null;
	export let itemType = 'item';
	export let isPinterestStyle = true;
	export let eagerLoadCount = 6; // Number of images to load eagerly
	export let priorityLoadCount = 3; // High priority images

	// Helper to extract image ID from processedPath if needed
	function getImageId(item: (typeof items)[0]): string | null {
		if (item.imageId) return item.imageId;
		// Try to extract from processedPath if available
		if (item.processedPath) {
			const match = item.processedPath.match(/\/([^-/]+)-thumbnail/);
			return match ? match[1] : null;
		}
		return null;
	}
</script>

<div class="m-0 p-0">
	{#if loading}
		<div>Loading {itemType}s...</div>
	{:else if error}
		<div>Error loading {itemType}s: {error.message}</div>
	{:else}
		<div class="photo-grid m-0 p-0" class:is-pinterest={isPinterestStyle}>
			{#each items as item, index (item.slug)}
				{@const imageId = getImageId(item)}
				<div class="photo-item m-0 p-0">
					<a
						href={item ? `${item.baseUrl}/${encodeURIComponent(item.slug)}` : ''}
						class="block m-0 p-0"
					>
						{#if imageId}
							<ResponsiveImage
								src={imageId}
								alt={item.title}
								eager={index < eagerLoadCount}
								priority={index < priorityLoadCount}
								className="block m-0 p-0"
								aspectRatio={isPinterestStyle ? undefined : '1/1'}
								objectFit={isPinterestStyle ? 'scale-down' : 'cover'}
								rootMargin={index < eagerLoadCount ? '200px' : '50px'}
								threshold={0.1}
							/>
						{:else if item.processedPath}
							<img
								src={item.processedPath}
								alt={item.title}
								loading={index < eagerLoadCount ? 'eager' : 'lazy'}
								fetchpriority={index < priorityLoadCount ? 'high' : 'auto'}
								decoding="async"
								class="block m-0 p-0"
							/>
						{:else}
							<div class="placeholder-image">
								<span>{item.title}</span>
							</div>
						{/if}
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>

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
		column-gap: 1rem;
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
		width: 100%;
		margin: 0 0 1rem 0;
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
		/* vertical-align: bottom; - ignored with display: block */
	}

	.photo-grid:not(.is-pinterest) .photo-item img {
		aspect-ratio: 1 / 1;
	}

	.photo-grid.is-pinterest .photo-item img {
		width: 100%;
		height: auto;
		display: block;
	}

	.placeholder-image {
		width: 100%;
		aspect-ratio: 1 / 1;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem;
		line-height: 1.2;
	}

	@media (min-width: 1025px) {
		.photo-grid {
			gap: 1.5rem;
		}

		.photo-grid.is-pinterest {
			column-gap: 1.5rem;
		}

		.photo-grid.is-pinterest .photo-item {
			margin-bottom: 1.5rem;
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
