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
	class="post-row w-full flex text-left bg-transparent hover:bg-gray-50 transition-colors duration-200"
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
>
	<div class="post-title border-b pl-3 text-left flex-1">
		{post.title}
	</div>

	<div class="post-subtitle border-b self-center flex-5 text-center">
		{post.subtitle}
	</div>

	<div class="post-date border-b pr-3 text-right flex-1">
		{new Date(post.date_created).toLocaleDateString()}
	</div>
</button>
