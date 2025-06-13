<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import type { DirectusSchema } from '$lib/directus';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PostRowMobile from '../../components/post/postRowMobile.svelte';

	export let data: { posts: DirectusSchema['posts'][] };
</script>

<SEO
	title="Posts"
	description="Read my latest blog posts about technology, programming, and personal thoughts"
/>

<DefaultPage title="Posts">
	<div class="space-y-2">
		{#each data.posts as post (post.id)}
			<PostRowMobile {post} />
		{/each}
	</div>
</DefaultPage>
