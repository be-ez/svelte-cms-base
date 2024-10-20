<script lang="ts">
	export let href = '';
	export let title = undefined;
	export let text = '';

	const queryParams = '?w=300;500;700&format=webp;jpg';
	const url = new URL(href);
	const modifiedSrc = `${url.pathname}${queryParams}`;
</script>

<img src={modifiedSrc} {title} alt={text} />
