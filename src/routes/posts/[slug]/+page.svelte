<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	import DefaultPage from '../../../components/layout/defaultPage.svelte';
	import customTable from '../../../components/table/customTable.svelte';
	import customTableBody from '../../../components/table/customTableBody.svelte';
	import customTableCell from '../../../components/table/customTableCell.svelte';
	import CustomTableHead from '../../../components/table/customTableHead.svelte';
	import customTableRow from '../../../components/table/customTableRow.svelte';
	import customCode from '../../../components/utils/customCode.svelte';
	import customHeading from '../../../components/utils/customHeading.svelte';
	import Image from '../../../components/utils/image.svelte';

	const renderers = {
		code: customCode,
		heading: customHeading,
		image: Image,
		table: customTable,
		tablebody: customTableBody,
		tablecell: customTableCell,
		tablehead: CustomTableHead,
		tablerow: customTableRow
	};
</script>

<DefaultPage title={data.post.title} subtitle={data.post.subtitle}>
	<div class="flex flex-wrap gap-2 mt-4">
		{#each data.post.tags as tag (tag)}
			<span class="tag bg-blue-500 text-white px-2 py-1 rounded">{tag}</span>
		{/each}
	</div>

	<SvelteMarkdown source={data.post.body} {renderers} />
</DefaultPage>
