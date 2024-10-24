<script lang="ts">
	import Highlight from 'svelte-highlight';
	import python from 'svelte-highlight/languages/python';
	import javascript from 'svelte-highlight/languages/javascript';
	import typescript from 'svelte-highlight/languages/typescript';
	import atomOneDark from 'svelte-highlight/styles/atom-one-dark';

	export let lang: string;
	export let text: string;

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
	{@html atomOneDark}
</svelte:head>

<Highlight {language} code={text} />
