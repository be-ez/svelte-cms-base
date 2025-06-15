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
	<div class="max-w-4xl mx-auto space-y-0">
		{#each data.posts as post, i (post.id)}
			<a href="/posts/{post.slug}" class="block py-8 border-b border-gray-200 dark:border-gray-700">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div class="flex-1">
						<h2
							class="text-xl md:text-2xl font-inter-heavy mb-2"
							style="color: var(--color-primary)"
						>
							{post.title}
						</h2>
						<p class="text-base md:text-lg leading-relaxed" style="color: var(--color-secondary)">
							{post.subtitle}
						</p>
					</div>
					<div
						class="text-sm md:text-base text-right flex-shrink-0"
						style="color: var(--color-tertiary)"
					>
						{new Date(post.date_created).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}
					</div>
				</div>
			</a>
		{/each}
	</div>
</DefaultPage>
