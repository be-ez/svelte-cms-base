<script>
	export let depth;
	export let raw;
</script>

{#if depth === 1}
	<h1><slot></slot></h1>
{:else if depth === 2}
	<h2><slot></slot></h2>
{:else if depth === 3}
	<h3><slot></slot></h3>
{:else if depth === 4}
	<h4><slot></slot></h4>
{:else if depth === 5}
	<h5><slot></slot></h5>
{:else if depth === 6}
	<h6><slot></slot></h6>
{:else}
	{raw}
{/if}

<style>
	h1 {
		font-size: 2em;
		margin: 0.67em 0;
		font-weight: bold;
	}

	h2 {
		font-size: 1.5em;
		margin: 0.75em 0;
		font-weight: bold;
	}

	h3 {
		font-size: 1.17em;
		margin: 0.83em 0;
		font-weight: bold;
	}

	h4 {
		font-size: 1em;
		margin: 1.12em 0;
		font-weight: bold;
	}

	h5 {
		font-size: 0.83em;
		margin: 1.5em 0;
		font-weight: bold;
	}

	h6 {
		font-size: 0.75em;
		margin: 1.67em 0;
		font-weight: bold;
	}
</style>
