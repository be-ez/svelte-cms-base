<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.photo.title}</h1>

<img src={`/assets/${data.photo.image}`} alt={data.photo.Title} />
