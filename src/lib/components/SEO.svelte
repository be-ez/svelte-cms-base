<script lang="ts">
	import { page } from '$app/stores';
	import { generateJSONLD, generateMetaTags, type SEOConfig } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		image?: string;
		article?: SEOConfig['article'];
		type?: string;
	}

	let { title, description, image, article, type = 'WebPage' }: Props = $props();

	const siteTitle = 'Personal Website';
	const fullTitle = $derived(title === siteTitle ? title : `${title} | ${siteTitle}`);

	const config = $derived<SEOConfig>({
		title: fullTitle,
		description,
		url: $page.url.href,
		image: image ? new URL(image, $page.url.origin).href : undefined,
		article
	});

	const metaTags = $derived(generateMetaTags(config));
	const _jsonLD = $derived(generateJSONLD({ ...config, type }));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={$page.url.href} />

	<!-- Open Graph / Facebook -->
	<meta property="og:title" content={metaTags['og:title']} />
	<meta property="og:description" content={metaTags['og:description']} />
	<meta property="og:type" content={metaTags['og:type']} />
	<meta property="og:url" content={metaTags['og:url']} />
	{#if metaTags['og:image']}
		<meta property="og:image" content={metaTags['og:image']} />
		<meta property="og:image:alt" content={metaTags['og:image:alt']} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content={metaTags['twitter:card']} />
	<meta name="twitter:title" content={metaTags['twitter:title']} />
	<meta name="twitter:description" content={metaTags['twitter:description']} />
	{#if metaTags['twitter:image']}
		<meta name="twitter:image" content={metaTags['twitter:image']} />
		<meta name="twitter:image:alt" content={metaTags['twitter:image:alt']} />
	{/if}

	<!-- Article specific -->
	{#if article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.tags && article.tags.length > 0}
			{#each article.tags as tag (tag)}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- JSON-LD structured data -->
	<!-- prettier-ignore -->
	<script type="application/ld+json">
{@html JSON.stringify(_jsonLD)}
	</script>
</svelte:head>
