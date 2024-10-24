<script lang="ts">
	import { isDarkMode } from '$lib/stores/theme';
</script>

<button
	class="theme-toggle flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary transition-colors"
	on:click={() => isDarkMode.toggle()}
	aria-label="Toggle theme"
>
	<span class="text-sm">{$isDarkMode ? '🌙' : '☀️'}</span>
	<span class="text-sm font-medium">{$isDarkMode ? 'Dark' : 'Light'}</span>
</button>
