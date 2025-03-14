<script lang="ts">
	import type { DirectusSchema } from '$lib/directus';

	import DefaultPage from '../components/layout/defaultPage.svelte';

	export let data: { global: DirectusSchema['global'] };
</script>

<DefaultPage title={data.global.Title} subtitle={data.global.Description} />
