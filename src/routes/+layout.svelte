<script lang="ts">
	import { onMount } from 'svelte';

	import { type GlobalSettings,globalSettings } from '$lib/stores/global';

	import Footer from '../components/layout/footer.svelte';
	import Header from '../components/layout/header.svelte';

	import '../app.css';

	export let data: { global: GlobalSettings | null };

	onMount(() => {
		if (data.global) {
			globalSettings.set(data.global);
			// Initialize analytics after global settings are loaded
			import('$lib/utils/analytics').then(({ initializeAnalytics }) => {
				initializeAnalytics();
			});
		}
	});
</script>

<!-- Skip to content link for screen readers -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:no-underline"
>
	Skip to main content
</a>

<div class="min-h-screen flex flex-col">
	<Header />
	<main id="main-content" class="flex-grow flex flex-col" tabindex="-1">
		<slot></slot>
	</main>
	<Footer />
</div>

<style>
	/* Ensure the layout takes up full height */
	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
	}
</style>
