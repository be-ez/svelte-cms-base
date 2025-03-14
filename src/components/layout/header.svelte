<script lang="ts">
	import { onMount } from 'svelte';

	import DesktopNavbar from '../navigation/DesktopNavbar.svelte';
	import MobileNavbar from '../navigation/MobileNavbar.svelte';

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
