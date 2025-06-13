<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;
	import { Markdown } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	import DefaultPage from '../../../components/layout/defaultPage.svelte';

	const plugins = [gfmPlugin()];
</script>

<DefaultPage title={data.recipe.title} subtitle={data.recipe.subtitle}>
	<Markdown md={data.recipe.body} {plugins} />
</DefaultPage>
