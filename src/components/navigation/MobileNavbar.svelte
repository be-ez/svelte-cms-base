<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { pageTitle, pageSubtitle, showBackButton } from '$lib/stores/navigation';

	let navItems = [
		{ name: 'Recipes', icon: '🍲', href: '/recipes' },
		{ name: 'Photos', icon: '📷', href: '/photos' },
		{ name: 'Posts', icon: '💻', href: '/posts' }
	];
	const currentPath = derived(page, ($page) => $page.url.pathname);

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<nav class="mobile-navbar bg-page border-b nav-border">
	<div class="px-2">
		<div class="flex justify-between items-center h-full py-1">
			<!-- Left side: About -->
			<div class="w-16">
				<a
					href="/about"
					class="text-2xl font-bold nav-link {$currentPath === '/about' ? 'underline' : ''}"
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
								on:click={() => window.history.go(-1)}
								aria-label="Go back"
							>
								&#8592;
							</button>
						{/if}
						<div class="text-xl font-inter-heavy text-default truncate max-w-[150px]">
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
			{#each navItems as item}
				<a href={item.href} class="block nav-link py-2" on:click|stopPropagation role="menuitem">
					<div class="flex justify-end">
						<span
							class="uppercase font-medium font-inter {$currentPath.startsWith(item.href)
								? 'underline'
								: ''}">{item.name}</span
						><span class="text-xs ml-2">{item.icon}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>

	{#if $pageSubtitle}
		<div class="text-lg text-center text-muted font-inter-medium pb-2 px-2">{$pageSubtitle}</div>
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
