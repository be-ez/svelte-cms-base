<script lang="ts">
	import EnhancedImg from '$lib/components/EnhancedImg.svelte';

	export let href = '';
	export let title = undefined;
	export let text = '';
	// Enable downloads by default for markdown content
	export let downloadable = true;

	// Extract image ID from href
	$: imageId = (() => {
		try {
			const url = new URL(href);
			return url.pathname.split('/').pop() || '';
		} catch {
			// If href is not a valid URL, assume it's already an image ID
			return href;
		}
	})();
</script>

{#if imageId}
	<EnhancedImg
		{imageId}
		alt={text}
		{title}
		enableDownload={downloadable}
		downloadName={imageId}
		className={downloadable ? 'cursor-pointer' : ''}
	/>
{:else}
	<!-- Fallback for invalid image references -->
	<img src={href} {title} alt={text} loading="lazy" />
{/if}
