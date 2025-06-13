<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;
	import { Markdown } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	import { isDarkMode } from '$lib/stores/theme';

	import DefaultPage from '../../../components/layout/defaultPage.svelte';

	const plugins = [gfmPlugin()];
</script>

<DefaultPage title={data.recipe.title} subtitle={data.recipe.subtitle}>
	<div class="max-w-4xl mx-auto py-12">
		<div class="prose prose-lg mx-auto max-w-none" class:prose-invert={$isDarkMode}>
			<Markdown md={data.recipe.body} {plugins} />
		</div>
	</div>
</DefaultPage>
