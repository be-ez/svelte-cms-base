<script lang="ts">
	import { onMount } from 'svelte';

	import { getProcessedImagePath } from '$lib/images';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PhotoGrid from '../../components/utils/PhotoGrid.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	interface Recipe {
		slug: string;
		title: string;
		cover_photo: string;
	}

	interface GridItem {
		slug: string;
		title: string;
		processedPath: string;
		baseUrl: string;
	}

	let loading = true;
	let error: Error | null = null;
	let gridItems: GridItem[] = [];

	onMount(async () => {
		try {
			gridItems = await Promise.all(
				data.recipes.map(async (recipe: Recipe) => ({
					slug: recipe.slug,
					title: recipe.title,
					processedPath: recipe.cover_photo
						? await getProcessedImagePath(recipe.cover_photo, 'thumbnail')
						: '',
					baseUrl: '/recipes'
				}))
			);
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to load images');
		} finally {
			loading = false;
		}
	});
</script>

<DefaultPage title="Recipes">
	<PhotoGrid items={gridItems} {loading} {error} itemType="recipe" />
</DefaultPage>
