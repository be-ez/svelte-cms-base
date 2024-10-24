<script>
	import DefaultPage from '../../components/layout/defaultPage.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<DefaultPage title="Recipes">
	<ul>
		{#each data.recipes as recipe}
			<li>
				- <a href={`/recipes/${recipe.slug}`}>{recipe.title}</a>
			</li>
		{/each}
	</ul>
</DefaultPage>
