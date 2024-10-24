<script lang="ts">
	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PostRowMobile from '../../components/post/postRowMobile.svelte';
	import type { DirectusSchema } from '$lib/directus';

	export let data: { posts: DirectusSchema['posts'][] };
</script>

<DefaultPage title="Posts">
	<div class="md:block">
		<div class="mobile-posts">
			{#each data.posts as post}
				<PostRowMobile {post} />
			{/each}
		</div>
	</div>
</DefaultPage>
