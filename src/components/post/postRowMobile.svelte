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
	class="post-row py-6 px-6 w-full flex flex-col items-start text-left bg-transparent hover:shadow-sm hover:scale-[1.01] transition-all duration-200"
	on:click={handleClick}
	on:keydown={e => e.key === 'Enter' && handleClick()}
>
	<div class="flex w-full items-center mb-2">
		<div class="post-title font-inter-heavy" style="color: var(--color-primary)">
			{post.title}
		</div>
		<div class="text-sm text-right ml-auto" style="color: var(--color-tertiary)">
			{new Date(post.date_created).toLocaleDateString()}
		</div>
	</div>
	<div class="post-subtitle w-full text-left text-sm" style="color: var(--color-secondary)">
		{post.subtitle}
	</div>
</button>
