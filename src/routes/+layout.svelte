<script lang="ts">
	import '../app.css';
	// import Nav from '../components/top_nav.svelte';
	import Header from '../components/header.svelte';
	import Footer from '../components/footer.svelte';
</script>

<div class="app">
	<Header />
	<main>
		<slot></slot>
	</main>
	<Footer />
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
