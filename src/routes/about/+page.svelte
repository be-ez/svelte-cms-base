<script lang="ts">
	import { Markdown } from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	import SEO from '$lib/components/SEO.svelte';
	import type { DirectusSchema } from '$lib/directus';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import ImageComponent from '../../components/utils/image.svelte';

	type Secret = DirectusSchema['secret_files'];

	const plugins = [gfmPlugin()];

	export let data: { secret_files: Secret[]; about: { content: string; meta_description: string } };
	let password = '';
	let isUnlocked = false;
	let secret: Secret = {
		id: '',
		password: '',
		title: '',
		body: ''
	};

	function unlock() {
		isUnlocked = data.secret_files.some((s: Secret) => s.password === password);
		if (isUnlocked) {
			const found = data.secret_files.find((s: Secret) => s.password === password);
			if (found) {
				secret = found;
			}
		}
	}
</script>

<SEO
	title="About Me"
	description={data.about.meta_description ||
		'Senior Software Engineer specializing in distributed systems, cloud architecture, and scalable data processing. Currently at SkyFi, previously at Telegraph, Planet, and Impossible Foods.'}
/>

<DefaultPage title="About Me">
	<!-- Public About Content -->
	<div class="prose dark:prose-invert max-w-none mb-12">
		<Markdown md={data.about.content || ''} {plugins}>
			{#snippet img(props)}
				<ImageComponent href={props.src || ''} title={props.title} text={props.alt || ''} />
			{/snippet}
		</Markdown>
	</div>

	<!-- Divider -->
	<div class="border-t border-gray-200 dark:border-gray-700 my-8"></div>

	<!-- Secret Files Section -->
	<div>
		{#if isUnlocked}
			{#if secret.body}
				<div>
					<div class="md:text-xl">{secret.title}</div>
					<div style="height: 20px;"></div>
					<Markdown md={secret.body} {plugins}>
						{#snippet img(props)}
							<ImageComponent href={props.src || ''} title={props.title} text={props.alt || ''} />
						{/snippet}
					</Markdown>
				</div>
				{#if secret.files}
					<div class="mt-8">
						<h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Attachments</h3>
						<div class="grid gap-3">
							{#each secret.files as file (file.directus_files_id.id)}
								<a
									href="/assets/{file.directus_files_id.id}?download"
									download
									class="group flex items-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
								>
									<div
										class="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3"
									>
										<svg
											class="w-5 h-5 text-blue-600 dark:text-blue-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
									<div class="flex-1 min-w-0">
										<p
											class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
										>
											{file.directus_files_id.filename_download}
										</p>
									</div>
									<div class="flex-shrink-0">
										<svg
											class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
								</a>
							{/each}
						</div>
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
