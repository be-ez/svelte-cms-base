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
	class="post-row w-full flex text-left bg-transparent hover:bg-subtle-hover hover:shadow-sm hover:scale-[1.01] transition-all duration-200"
	on:click={handleClick}
	on:keydown={e => e.key === 'Enter' && handleClick()}
>
	<div class="post-title border-b border-default pl-3 text-left text-default flex-1">
		{post.title}
	</div>

	<div class="post-subtitle border-b border-default self-center text-muted flex-5 text-center">
		{post.subtitle}
	</div>

	<div class="post-date border-b border-default pr-3 text-right text-subtle flex-1">
		{new Date(post.date_created).toLocaleDateString()}
	</div>
</button>
