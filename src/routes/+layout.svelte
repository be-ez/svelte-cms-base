<script lang="ts">
	import Footer from '../components/layout/footer.svelte';
	import Header from '../components/layout/header.svelte';

	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
	<Header />
	<main class="flex-grow flex flex-col px-4 md:px-0">
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
