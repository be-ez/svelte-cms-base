<script lang="ts">
	import DefaultPage from '../components/layout/defaultPage.svelte';
	import type { DirectusSchema } from '$lib/directus';

	export let data: { global: DirectusSchema['global'] };
</script>

<DefaultPage title={data.global.Title} subtitle={data.global.Description}></DefaultPage>
