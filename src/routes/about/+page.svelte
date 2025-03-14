<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	import type { DirectusSchema } from '$lib/directus';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import customTable from '../../components/table/customTable.svelte';
	import customTableBody from '../../components/table/customTableBody.svelte';
	import customTableCell from '../../components/table/customTableCell.svelte';
	import CustomTableHead from '../../components/table/customTableHead.svelte';
	import customTableRow from '../../components/table/customTableRow.svelte';
	import customCode from '../../components/utils/customCode.svelte';
	import customHeading from '../../components/utils/customHeading.svelte';
	import Image from '../../components/utils/image.svelte';

	type Secret = DirectusSchema['secret_files'];

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

	export let data: { secrets: Secret[] };
	let password = '';
	let isUnlocked = false;
	let secret: Secret = {
		id: '',
		password: '',
		title: '',
		body: ''
	};

	function unlock() {
		isUnlocked = data.secrets.some((s: Secret) => s.password === password);
		if (isUnlocked) {
			const found = data.secrets.find((s: Secret) => s.password === password);
			if (found) {
				secret = found;
			}
		}
	}
</script>

<DefaultPage title="About Me">
	<div>
		{#if isUnlocked}
			{#if secret.body}
				<div>
					<div class="md:text-xl">{secret.title}</div>
					<div style="height: 20px;"></div>
					<SvelteMarkdown source={secret.body} {renderers} />
				</div>
				{#if secret.files}
					<div class="resume-section">
						<div class="md:text-xl">Attachments</div>
						<ul>
							{#each secret.files as file (file.directus_files_id.id)}
								<a href="/assets/{file.directus_files_id.id}?download" download>
									{file.directus_files_id.filename_download}</a
								>
							{/each}
						</ul>
					</div>
				{/if}
			{/if}
		{/if}
	</div>
	{#if !isUnlocked}
		<div class="flex flex-col md:flex-row justify-center items-center mt-10">
			<input
				type="password"
				bind:value={password}
				placeholder="Enter password"
				class="mb-2 md:mb-0 md:mr-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				on:click={unlock}
				class="bg-transparent border border-gray-500 text-gray-700 hover:bg-gray-100 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
			>
				Unlock
			</button>
		</div>
	{/if}
</DefaultPage>
