<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: { post: any; global: any };

	import { Markdown } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	import SEO from '$lib/components/SEO.svelte';
	import { isDarkMode } from '$lib/stores/theme';

	import DefaultPage from '../../../components/layout/defaultPage.svelte';

	const plugins = [gfmPlugin()];
</script>

<SEO
	title={data.post.title}
	description={data.post.meta_description ||
		data.post.subtitle ||
		`Read ${data.post.title} on my blog`}
	image={data.post.featured_image}
	article={{
		publishedTime: data.post.date_created,
		modifiedTime: data.post.date_updated,
		author: data.global?.author_name,
		tags: data.post.tags
	}}
	type="Article"
/>

<DefaultPage title={data.post.title} subtitle={data.post.subtitle}>
	<div class="flex flex-wrap gap-2 mt-4">
		{#each data.post.tags as tag (tag)}
			<span class="tag bg-blue-500 text-white px-2 py-1 rounded">{tag}</span>
		{/each}
	</div>
	<div class="max-w-4xl mx-auto py-12">
		<div class="prose prose-lg mx-auto max-w-none" class:prose-invert={$isDarkMode}>
			<Markdown md={data.post.body} {plugins} />
		</div>
	</div>
</DefaultPage>
