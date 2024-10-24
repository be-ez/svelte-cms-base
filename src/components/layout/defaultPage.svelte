<script lang="ts">
	import { pageTitle, pageSubtitle, showBackButton } from '$lib/stores/navigation';
	import { onMount, onDestroy } from 'svelte';

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

<div class="mx-auto w-full p-0 md:px-8 xs:p-0">
	<slot></slot>
</div>
