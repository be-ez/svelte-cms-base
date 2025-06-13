<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PhotoGrid from '../../components/utils/PhotoGrid.svelte';

	interface Photo {
		slug: string;
		title: string;
		image: string;
	}

	interface PageData {
		photos: Photo[];
	}

	export let data: PageData;
	let isPinterestStyle = true;

	// Transform photos to grid items
	$: gridItems = data.photos.map(photo => ({
		slug: photo.slug.trim(),
		title: photo.title,
		imageId: photo.image,
		baseUrl: '/photos'
	}));
</script>

<SEO
	title="Photos"
	description="Browse my photography collection featuring nature, travel, and street photography"
/>

<DefaultPage title="Photos">
	<PhotoGrid items={gridItems} loading={false} error={null} itemType="photo" {isPinterestStyle} />
</DefaultPage>
