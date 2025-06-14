<script lang="ts">
	import githubDarkUrl from 'highlight.js/styles/github-dark.css?url';
	// Import highlight.js themes as URLs
	import stackoverflowLightUrl from 'highlight.js/styles/stackoverflow-light.css?url';
	import rehypeHighlight from 'rehype-highlight';

	import { Markdown } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	import SEO from '$lib/components/SEO.svelte';
	import type { DirectusSchema } from '$lib/directus';
	import { isDarkMode } from '$lib/stores/theme';

	import DefaultPage from '../components/layout/defaultPage.svelte';
	import ImageComponent from '../components/utils/image.svelte';

	export let data: { global: DirectusSchema['global'] | null };

	// Ensure we always have strings, even if null
	const title = data.global?.Title || '';
	const description = data.global?.Description || '';

	// Configure plugins
	// const plugins = [gfmPlugin(), rehypeHighlight()];
	const plugins = [gfmPlugin(), { rehypePlugin: rehypeHighlight }];
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<svelte:head>
	{#if $isDarkMode}
		<link rel="stylesheet" href={githubDarkUrl} />
	{:else}
		<link rel="stylesheet" href={stackoverflowLightUrl} />
	{/if}
</svelte:head>

<SEO {title} {description} />

<DefaultPage {title} subtitle={description}>
	<div class="max-w-4xl mx-auto">
		{#if data.global?.Homepage_Content}
			<div class="prose prose-lg mx-auto max-w-none" class:prose-invert={$isDarkMode}>
				<Markdown md={data.global.Homepage_Content} {plugins}>
					{#snippet img(props)}
						<ImageComponent href={props.src || ''} title={props.title} text={props.alt || ''} />
					{/snippet}
				</Markdown>
			</div>
		{/if}
	</div>
</DefaultPage>
