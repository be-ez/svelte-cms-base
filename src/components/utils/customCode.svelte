<script lang="ts">
	import Highlight from 'svelte-highlight';
	import javascript from 'svelte-highlight/languages/javascript';
	import python from 'svelte-highlight/languages/python';
	import typescript from 'svelte-highlight/languages/typescript';
	import githubDark from 'svelte-highlight/styles/github-dark';
	import light from 'svelte-highlight/styles/stackoverflow-light';

	import { isDarkMode } from '$lib/stores/theme';

	export let lang: string = '';
	export let text: string = '';

	$: language = (() => {
		switch (lang) {
			case 'javascript':
				return javascript;
			case 'typescript':
				return typescript;
			default:
				return python;
		}
	})();
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<svelte:head>
	{#if $isDarkMode}
		{@html githubDark}
	{:else}
		{@html light}
	{/if}
</svelte:head>

<div class="not-prose my-4">
	<div class="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
		{#if lang}
			<div
				class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
			>
				<span>{lang}</span>
			</div>
		{/if}
		<div class="overflow-x-auto bg-gray-50 dark:bg-gray-900">
			<Highlight {language} code={text} />
		</div>
	</div>
</div>
