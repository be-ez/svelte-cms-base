<script>
	/** @type {import('./$types').PageData} */
	export let data;
	import SvelteMarkdown from 'svelte-markdown';
	import Image from '../../../components/image.svelte';
</script>

<h1>{data.recipe.Title}</h1>

<SvelteMarkdown source={data.recipe.Body} renderers={{ image: Image }} />
