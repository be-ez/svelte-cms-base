<script lang="ts">
	import ThemeToggle from '../utils/ThemeToggle.svelte';
	import { globalSettings } from '$lib/stores/global';

	$: socials = $globalSettings ? [
		...(($globalSettings.social_github && { name: 'GitHub', href: $globalSettings.social_github, icon: '💻' }) ? [{ name: 'GitHub', href: $globalSettings.social_github, icon: '💻' }] : []),
		...(($globalSettings.social_linkedin && { name: 'LinkedIn', href: $globalSettings.social_linkedin, icon: '💼' }) ? [{ name: 'LinkedIn', href: $globalSettings.social_linkedin, icon: '💼' }] : []),
		...(($globalSettings.social_instagram && { name: 'Instagram', href: $globalSettings.social_instagram, icon: '📸' }) ? [{ name: 'Instagram', href: $globalSettings.social_instagram, icon: '📸' }] : [])
	] : [];

	$: contactEmail = $globalSettings?.contact_email || '';
	$: currentYear = new Date().getFullYear();
</script>

<footer class="bg-background py-1 nav-border items-center">
	<div class="container mx-auto flex flex-col md:flex-row items-center px-2">
		<div class="flex-1 flex space-x-4 md:my-2 md:my-0 justify-start items-center">
			{#if contactEmail}
				<div class="text-center md:text-left">
					<p class="text-xs">
						<a href="mailto:{contactEmail}" class="nav-link">📧</a>
					</p>
				</div>
			{/if}
			{#each socials as social (social.name)}
				<a href={social.href} class="nav-link text-xs" target="_blank" rel="noopener noreferrer"
					>{social.icon}</a
				>
			{/each}
		</div>
		<div class="flex-1 flex items-center justify-center">
			<ThemeToggle />
		</div>
		<div class="flex-1 text-xs text-center md:text-right">
			<p>© {currentYear}</p>
		</div>
	</div>
</footer>
