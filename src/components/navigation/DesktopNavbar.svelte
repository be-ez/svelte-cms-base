<script lang="ts">
	import { derived } from 'svelte/store';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pageSubtitle, pageTitle, showBackButton } from '$lib/stores/navigation';

	let navItems = [
		{ name: 'Recipes', icon: '🍲', href: '/recipes' },
		{ name: 'Photos', icon: '📷', href: '/photos' },
		{ name: 'Posts', icon: '💻', href: '/posts' }
	];
	const currentPath = derived(page, $page => $page.url.pathname);

	function handleHeaderClick() {
		goto('/');
	}
</script>

<nav class="w-full bg-page border-b nav-border">
	<div
		class="w-full text-left cursor-pointer"
		on:click={handleHeaderClick}
		on:keydown={e => e.key === 'Enter' && handleHeaderClick()}
		role="button"
		tabindex="0"
	>
		<div class="px-8 py-2">
			<div class="flex items-center justify-between">
				<!-- Left: About -->
				<div class="w-32">
					<a
						href="/about"
						class="text-2xl font-bold nav-link {$currentPath === '/about' ? 'underline' : ''}"
						on:click|stopPropagation
					>
						Alex
					</a>
				</div>

				<!-- Center: Title with optional back button -->
				<div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
					{#if $pageTitle}
						{#if $showBackButton}
							<button
								class="nav-link"
								on:click|stopPropagation={() => window.history.go(-1)}
								aria-label="Go back"
							>
								&#8592;
							</button>
						{/if}
						<div class="text-2xl font-inter-heavy text-default">{$pageTitle}</div>
					{/if}
				</div>

				<!-- Right: Navigation -->
				<div class="w-32 flex items-center justify-end gap-4">
					{#each navItems as item, i (item.name)}
						<a
							href={item.href}
							class="group relative px-5 w-6 h-6 flex items-center justify-center"
							on:click|stopPropagation
						>
							<span
								class="absolute inset-0 flex items-center justify-center transition-opacity duration-200
								{$currentPath.startsWith(item.href) ? 'underline' : ''} group-hover:opacity-0"
							>
								{item.icon}
							</span>
							<span
								class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200
								{$currentPath.startsWith(item.href) ? 'underline' : ''}"
							>
								{item.name}
							</span>
						</a>
						{#if i < navItems.length - 1}
							<span class="text-sm">|</span>
						{/if}
					{/each}
				</div>
			</div>

			{#if $pageSubtitle}
				<div class="text-xl text-center text-muted font-inter-medium mt-1">
					{$pageSubtitle}
				</div>
			{/if}
		</div>
	</div>
</nav>
