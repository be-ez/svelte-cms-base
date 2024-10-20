<script>
	let navItems = [
		{ name: 'Home', link: '/' },
		{ name: 'Recipes', link: '/recipes' },
		{ name: 'Photos', link: '/photos' },
		{ name: 'Projects', link: '/projects' }
	];
</script>

<nav>
	<ul>
		{#each navItems as item}
			<li><a href={item.link}>{item.name}</a></li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		background-color: #333;
		padding: 1rem;
	}
	ul {
		list-style: none;
		display: flex;
		justify-content: space-around;
		margin: 0;
		padding: 0;
	}
	li {
		margin: 0;
	}
	a {
		color: white;
		text-decoration: none;
		font-size: 1.2rem;
	}
	a:hover {
		text-decoration: underline;
	}
</style>
