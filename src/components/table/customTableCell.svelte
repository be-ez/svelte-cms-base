<script>
	export let header;
	export let align;
</script>

{#if header}
	<th class="px-4 py-2 text-left" {align}><slot></slot></th>
{:else}
	<td class="px-4 py-2" {align}><slot></slot></td>
{/if}
