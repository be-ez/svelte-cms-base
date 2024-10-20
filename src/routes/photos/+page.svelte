<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;
	let isPinterestStyle = true; // Toggle this to switch styles
</script>

<label>
	<input type="checkbox" bind:checked={isPinterestStyle} />
	Toggle Pinterest Style
</label>
<div class="photo-grid" class:is-pinterest={isPinterestStyle}>
	{#each data.photos as photo}
		<div class="photo-item">
			<a href={photo ? `/photos/${encodeURIComponent(photo.slug)}` : ''}>
				<img src={`/assets/${photo.image}`} alt={photo.title} />
			</a>
		</div>
	{/each}
</div>

<style>
	.photo-grid {
		display: grid;
		/* gap: 0; Remove gap between images */
	}

	.photo-grid:not(.is-pinterest) {
		grid-template-columns: repeat(4, 1fr);
	}

	.photo-grid.is-pinterest {
		/* display: grid; */
		/* Create 3 equal-width columns */
		grid-template-columns: repeat(3, 1fr);
		/* Enable masonry layout for rows */
		grid-template-rows: masonry;
		/* Optional: Control the placement of grid items */
		grid-auto-flow: dense;
	}

	.photo-item {
		width: 100%; /* Image fills the width of the grid column */
		height: auto; /* Height adjusts proportionally */
		display: block; /* Removes any inline spacing */
	}
	/* position: relative;
		width: 100%;
		overflow: hidden; */

	.photo-item img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	.photo-grid:not(.is-pinterest) .photo-item img {
		aspect-ratio: 1 / 1; /* Maintain 1:1 Aspect Ratio for Instagram style */
	}

	.photo-grid.is-pinterest .photo-item img {
		/* aspect-ratio: auto; */
	}
</style>
