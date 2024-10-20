<script>
	let navItems = [
		{ name: 'Recipes', icon: '🍲', href: '/recipes' },
		{ name: 'Photos', icon: '📷', href: '/photos' },
		{ name: 'Projects', icon: '💻', href: '/projects' }
	];
</script>

<nav class="flex justify-between items-center p-4 border-b border-gray-300 bg-white">
	<!-- Left side: Name/Logo -->
	<div class="text-2xl font-bold">Alex</div>

	<!-- Right side: Navigation links -->
	<div class="flex space-x-8">
		{#each navItems as item, i}
			<a href={item.href} class="flex items-center space-x-2 hover:text-blue-500 transition-all">
				<span class="text-lg">{item.icon}</span>
				<span class="uppercase font-medium">{item.name}</span>
			</a>
			{#if i < navItems.length - 1}
				<span class="border-l border-gray-300 h-6"></span>
			{/if}
		{/each}
	</div>
</nav>
