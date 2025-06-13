<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { pageSubtitle, pageTitle, showBackButton } from '$lib/stores/navigation';

	export let title = '';
	export let subtitle = '';
	export let showBack = true;

	onMount(() => {
		pageTitle.set(title);
		pageSubtitle.set(subtitle);
		showBackButton.set(showBack);
	});

	onDestroy(() => {
		pageTitle.set('');
		pageSubtitle.set('');
		showBackButton.set(false);
	});
</script>

<div class="page-container content-spacing">
	<slot></slot>
</div>
