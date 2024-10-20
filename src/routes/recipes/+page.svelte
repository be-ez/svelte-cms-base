<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<span><p>Recipes</p></span>

<ul>
	{#each data.recipes as recipe}
		<li>
			- <a href={`/recipes/${recipe.slug}`}>{recipe.Title}</a>
		</li>
	{/each}
</ul>
