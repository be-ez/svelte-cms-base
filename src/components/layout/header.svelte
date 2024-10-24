<script lang="ts">
	import DesktopNavbar from '../navigation/DesktopNavbar.svelte';
	import MobileNavbar from '../navigation/MobileNavbar.svelte';
	import { onMount } from 'svelte';

	let isMobile = false;
	let mounted = false;

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth <= 768;
		};

		checkMobile();
		mounted = true;
		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

{#if mounted}
	{#if isMobile}
		<MobileNavbar />
	{:else}
		<DesktopNavbar />
	{/if}
{/if}

<style>
	/* Hide desktop navbar on mobile screens before JS loads */
	:global(.desktop-navbar) {
		display: none;
	}

	@media (min-width: 769px) {
		:global(.desktop-navbar) {
			display: flex;
		}
		:global(.mobile-navbar) {
			display: none;
		}
	}

	@media (max-width: 768px) {
		:global(.desktop-navbar) {
			display: none;
		}
		:global(.mobile-navbar) {
			display: block;
		}
	}
</style>
