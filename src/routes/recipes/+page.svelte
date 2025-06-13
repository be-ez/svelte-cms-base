<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PhotoGrid from '../../components/utils/PhotoGrid.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	interface _Recipe {
		slug: string;
		title: string;
		cover_photo: string;
	}

	let isPinterestStyle = false;

	// Transform recipes to grid items
	$: gridItems = data.recipes.map((recipe: any) => ({
		slug: recipe.slug,
		title: recipe.title,
		imageId: recipe.cover_photo,
		baseUrl: '/recipes'
	}));
</script>

<SEO
	title="Recipes"
	description="Discover my collection of delicious recipes from around the world"
/>

<DefaultPage title="Recipes">
	<PhotoGrid items={gridItems} loading={false} error={null} itemType="recipe" {isPinterestStyle} />
</DefaultPage>
