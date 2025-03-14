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
	class="post-row py-2 w-full flex flex-col items-start text-left bg-transparent hover:bg-gray-50 transition-colors duration-200"
	on:click={handleClick}
	on:keydown={e => e.key === 'Enter' && handleClick()}
>
	<div class="flex w-full items-center">
		<div class="post-title font-inter-heavy">
			{post.title}
		</div>
		<div class="post-meta text-sm text-right ml-auto">
			{new Date(post.date_created).toLocaleDateString()}
		</div>
	</div>
	<div class="post-subtitle w-full text-left post-meta text-sm">
		{post.subtitle}
	</div>
</button>
