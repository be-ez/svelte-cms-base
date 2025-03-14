<script lang="ts">
	import ThemeToggle from '../utils/ThemeToggle.svelte';

	const socials = [
		{ name: 'GitHub', href: 'https://github.com/be-ez', icon: '💻' },
		{ name: 'LinkedIn', href: 'https://www.linkedin.com/in/shulmanalex/', icon: '💼' },
		{ name: 'Instagram', icon: '📸', href: 'https://instagram.com/dooooooo_ooooooood' }
	];
</script>

<footer class="bg-background py-1 nav-border items-center">
	<div class="container mx-auto flex flex-col md:flex-row justify-between items-center px-2">
		<div class="flex space-x-4 md:my-2 md:my-0 justify-center items-center">
			<div class="text-center md:text-left">
				<p class="text-xs">
					<a href="mailto:alex@shulman.dev" class="nav-link">📧</a>
				</p>
			</div>
			{#each socials as social (social.name)}
				<a href={social.href} class="nav-link text-xs" target="_blank" rel="noopener noreferrer"
					>{social.icon}</a
				>
			{/each}
		</div>
		<div class="flex items-center">
			<ThemeToggle />
		</div>
		<div class="text-xs text-center md:text-right">
			<p>© 2025</p>
		</div>
	</div>
</footer>
