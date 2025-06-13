<script lang="ts">
	interface Props {
		preloadImages?: string[];
		preconnectDomains?: string[];
		dnsPrefetchDomains?: string[];
		preloadFonts?: string[];
	}

	let {
		preloadImages = [],
		preconnectDomains = [],
		dnsPrefetchDomains = [],
		preloadFonts = []
	}: Props = $props();
</script>

<svelte:head>
	<!-- Preconnect to external domains -->
	{#each preconnectDomains as domain (domain)}
		<link rel="preconnect" href={domain} />
	{/each}

	<!-- DNS prefetch for external domains -->
	{#each dnsPrefetchDomains as domain (domain)}
		<link rel="dns-prefetch" href={domain} />
	{/each}

	<!-- Preload critical images -->
	{#each preloadImages as image (image)}
		<link rel="preload" href={image} as="image" fetchpriority="high" />
	{/each}

	<!-- Preload critical fonts -->
	{#each preloadFonts as font (font)}
		<link rel="preload" href={font} as="font" type="font/woff2" crossorigin="anonymous" />
	{/each}
</svelte:head>
