<script lang="ts">
	import type { DirectusSchema } from '$lib/directus';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PostRowMobile from '../../components/post/postRowMobile.svelte';

	export let data: { posts: DirectusSchema['posts'][] };
</script>

<DefaultPage title="Posts">
	<div class="md:block">
		<div class="mobile-posts">
			{#each data.posts as post (post.id)}
				<PostRowMobile {post} />
			{/each}
		</div>
	</div>
</DefaultPage>
