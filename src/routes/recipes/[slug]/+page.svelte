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

<DefaultPage title={data.recipe.title} subtitle={data.recipe.subtitle}>
	<SvelteMarkdown source={data.recipe.body} {renderers} />
</DefaultPage>
