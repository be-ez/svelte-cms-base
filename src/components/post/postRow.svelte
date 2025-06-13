<script lang="ts">
	interface Post {
		slug: string;
		title: string;
		subtitle: string;
		date_created: string;
	}

	export let post: Post;

	function handleClick() {
		window.location.href = `/posts/${post.slug}`;
	}
</script>

<button
	class="post-row w-full flex text-left bg-transparent hover:shadow-sm hover:scale-[1.01] transition-all duration-200"
	on:click={handleClick}
	on:keydown={e => e.key === 'Enter' && handleClick()}
>
	<div
		class="post-title border-b pl-6 py-4 text-left flex-1"
		style="border-color: var(--color-border); color: var(--color-primary)"
	>
		{post.title}
	</div>

	<div
		class="post-subtitle border-b py-4 self-center flex-5 text-center"
		style="border-color: var(--color-border); color: var(--color-secondary)"
	>
		{post.subtitle}
	</div>

	<div
		class="post-date border-b pr-6 py-4 text-right flex-1"
		style="border-color: var(--color-border); color: var(--color-tertiary)"
	>
		{new Date(post.date_created).toLocaleDateString()}
	</div>
</button>
