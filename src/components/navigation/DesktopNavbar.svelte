<script lang="ts">
	import { derived } from 'svelte/store';

	import { page } from '$app/stores';
	import { globalSettings } from '$lib/stores/global';
	import { pageSubtitle, pageTitle, showBackButton } from '$lib/stores/navigation';

	const currentPath = derived(page, $page => $page.url.pathname);

	// Default navigation items as fallback
	const defaultNavItems = [
		{ name: 'Recipes', icon: '🍲', href: '/recipes' },
		{ name: 'Photos', icon: '📷', href: '/photos' },
		{ name: 'Posts', icon: '💻', href: '/posts' }
	];

	$: navItems = $globalSettings?.navigation_menu || defaultNavItems;
	$: authorName = $globalSettings?.author_name || '';
</script>

<nav class="desktop-navbar w-full bg-page border-b nav-border">
	<div class="px-8 py-4">
		<div class="grid grid-cols-3 items-center">
			<!-- Left: About + Home -->
			<div class="flex items-center gap-2">
				<a href="/" class="text-lg nav-link" aria-label="Go to homepage">🏠</a>
				{#if authorName}
					<a
						href="/about"
						class="text-2xl font-bold nav-link {$currentPath === '/about' ? 'underline' : ''}"
					>
						{authorName}
					</a>
				{/if}
			</div>

			<!-- Center: Title with optional back button -->
			<div class="flex items-center justify-center gap-4">
				{#if $pageTitle}
					{#if $showBackButton}
						<button
							class="nav-link"
							on:click|stopPropagation={() => {
								// Check if we can safely go back without leaving the site
								if (
									window.history.length > 1 &&
									document.referrer &&
									document.referrer.includes(window.location.host)
								) {
									window.history.go(-1);
								} else {
									// Navigate to home page instead
									window.location.href = '/';
								}
							}}
							aria-label="Go back"
						>
							&#8592;
						</button>
					{/if}
					<div class="text-2xl font-inter-heavy" style="color: var(--color-primary)">
						{$pageTitle}
					</div>
				{/if}
			</div>

			<!-- Right: Navigation -->
			<div class="flex items-center justify-end gap-4">
				{#each navItems as item, i (item.name)}
					<a
						href={item.href}
						class="group relative px-5 w-6 h-6 flex items-center justify-center"
						on:click|stopPropagation
						aria-label="Navigate to {item.name}"
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
		<div class="text-xl text-center font-inter-medium mt-2" style="color: var(--color-secondary)">
			{#if $pageSubtitle}
				{$pageSubtitle}
			{:else}
				&nbsp;
			{/if}
		</div>
	</div>
</nav>
