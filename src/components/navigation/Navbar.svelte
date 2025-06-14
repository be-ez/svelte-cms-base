<script lang="ts">
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	import { page } from '$app/stores';
	import { pageSubtitle, pageTitle, showBackButton } from '$lib/stores/navigation';

	let navItems = [
		{ name: 'Recipes', icon: '🍲', href: '/recipes' },
		{ name: 'Photos', icon: '📷', href: '/photos' },
		{ name: 'Posts', icon: '💻', href: '/posts' }
	];
	const currentPath = derived(page, $page => $page.url.pathname);

	let isOpen = false;
	let isMobile = false;

	onMount(() => {
		function updateMobile() {
			isMobile = window.innerWidth < 768;
		}
		updateMobile();
		window.addEventListener('resize', updateMobile);
		return () => window.removeEventListener('resize', updateMobile);
	});

	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<nav class="w-full bg-page border-b nav-border">
	<div class="px-6 md:px-8">
		{#if isMobile}
			<!-- Mobile Layout -->
			<div class="flex justify-between items-center h-full py-3">
				<!-- Left side: Home + About -->
				<div class="flex items-center gap-1">
					<a href="/" class="text-sm nav-link" aria-label="Go to homepage">🏠</a>
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
				<div class="flex justify-end">
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

			<!-- Mobile Dropdown Menu -->
			<div class="menu {isOpen ? 'open' : ''}" role="menu" aria-hidden={!isOpen}>
				{#each navItems as item (item.name)}
					<a href={item.href} class="block nav-link py-3" on:click|stopPropagation role="menuitem">
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
		{:else}
			<!-- Desktop Layout -->
			<div class="py-4">
				<div class="grid grid-cols-3 items-center">
					<!-- Left: About + Home -->
					<div class="flex items-center gap-2">
						<a href="/" class="text-lg nav-link" aria-label="Go to homepage">🏠</a>
						<a
							href="/about"
							class="text-2xl font-bold nav-link {$currentPath === '/about' ? 'underline' : ''}"
						>
							Alex
						</a>
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
				<div
					class="text-xl text-center font-inter-medium mt-2"
					style="color: var(--color-secondary)"
				>
					{#if $pageSubtitle}
						{$pageSubtitle}
					{:else}
						&nbsp;
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if isMobile && $pageSubtitle}
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
