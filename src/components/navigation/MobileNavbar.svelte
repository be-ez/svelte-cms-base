<script lang="ts">
	import { onMount } from 'svelte';

	import { pageSubtitle, pageTitle, showBackButton } from '$lib/stores/navigation';

	let navItems = [
		{ name: 'Recipes', icon: '🍲', href: '/recipes' },
		{ name: 'Photos', icon: '📷', href: '/photos' },
		{ name: 'Posts', icon: '💻', href: '/posts' }
	];

	let currentPath = '';

	// Update currentPath when the component mounts and when the URL changes
	onMount(() => {
		updateCurrentPath();
		window.addEventListener('popstate', updateCurrentPath);
		return () => window.removeEventListener('popstate', updateCurrentPath);
	});

	function updateCurrentPath() {
		currentPath = window.location.pathname;
	}

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<nav class="mobile-navbar bg-page border-b nav-border">
	<div class="px-6">
		<div class="flex justify-between items-center h-full py-3">
			<!-- Left side: Home + About -->
			<div class="w-16 flex items-center gap-1">
				<a href="/" class="text-sm nav-link" aria-label="Go to homepage">🏠</a>
				<a
					href="/about"
					class="text-2xl font-bold nav-link {currentPath === '/about' ? 'underline' : ''}"
					on:click|stopPropagation>Alex</a
				>
			</div>

			<!-- Center: Back button and Title -->
			<div class="flex-1 flex items-center justify-center min-w-0">
				{#if $pageTitle}
					<div class="flex items-center">
						{#if $showBackButton}
							<button
								class="mr-2 nav-link"
								on:click={() => {
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
						<div
							class="text-xl font-inter-heavy truncate max-w-[250px]"
							style="color: var(--color-primary)"
						>
							{$pageTitle}
						</div>
					</div>
				{/if}
			</div>

			<!-- Right side: Hamburger Menu -->
			<div class="w-16 flex justify-end">
				<button
					class="hamburger text-2xl pb-1 flex items-center"
					on:click={toggleMenu}
					aria-label="Toggle menu"
					aria-expanded={isOpen}
					type="button"
				>
					<span>☰</span>
				</button>
			</div>
		</div>

		<!-- Dropdown Menu -->
		<div class="menu {isOpen ? 'open' : ''}" role="menu" aria-hidden={!isOpen}>
			{#each navItems as item (item.name)}
				<a href={item.href} class="block nav-link py-3" on:click|stopPropagation role="menuitem">
					<div class="flex justify-end">
						<span
							class="uppercase font-medium font-inter {currentPath.startsWith(item.href)
								? 'underline'
								: ''}">{item.name}</span
						><span class="text-xs ml-2">{item.icon}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>

	{#if $pageSubtitle}
		<div
			class="text-lg text-center font-inter-medium pb-3 px-6"
			style="color: var(--color-secondary)"
		>
			{$pageSubtitle}
		</div>
	{/if}
</nav>

<style>
	.hamburger {
		cursor: pointer;
	}
	.menu {
		display: none;
	}
	.menu.open {
		display: block;
	}
</style>
