<script lang="ts">
	import { Markdown } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	import SEO from '$lib/components/SEO.svelte';
	import type { DirectusSchema } from '$lib/directus';

	import DefaultPage from '../../components/layout/defaultPage.svelte';

	type Secret = DirectusSchema['secret_files'];

	const plugins = [gfmPlugin()];

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

<SEO title="About Me" description="Learn more about me, my background, and my work." />

<DefaultPage title="About Me">
	<div>
		{#if isUnlocked}
			{#if secret.body}
				<div>
					<div class="md:text-xl">{secret.title}</div>
					<div style="height: 20px;"></div>
					<Markdown md={secret.body} {plugins} />
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
