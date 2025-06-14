<script lang="ts">
	import { isDarkMode } from '$lib/stores/theme';
</script>

<button class="theme-toggle" on:click={() => isDarkMode.toggle()} aria-label="Toggle theme">
	{$isDarkMode ? '🌙' : '☀️'}
</button>
