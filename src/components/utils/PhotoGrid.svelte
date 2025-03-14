<script lang="ts">
	export let items: {
		slug: string;
		title: string;
		processedPath: string;
		baseUrl: string;
	}[] = [];
	export let loading = false;
	export let error: Error | null = null;
	export let itemType = 'item';

	let isPinterestStyle = true;
</script>

<div class="m-0 p-0">
	<label class="m-0 p-0 inline-block">
		<input type="checkbox" bind:checked={isPinterestStyle} />
		Toggle Pinterest Style
	</label>

	{#if loading}
		<div>Loading {itemType}s...</div>
	{:else if error}
		<div>Error loading {itemType}s: {error.message}</div>
	{:else}
		<div class="photo-grid m-0 p-0" class:is-pinterest={isPinterestStyle}>
			{#each items as item (item.slug)}
				<div class="photo-item m-0 p-0">
					<a
						href={item ? `${item.baseUrl}/${encodeURIComponent(item.slug)}` : ''}
						class="block m-0 p-0"
					>
						{#if item.processedPath}
							<img
								src={item.processedPath}
								alt={item.title}
								loading="lazy"
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
