<script lang="ts">
	import { onMount } from 'svelte';

	import { getProcessedImagePath } from '$lib/images';

	import DefaultPage from '../../components/layout/defaultPage.svelte';
	import PhotoGrid from '../../components/utils/PhotoGrid.svelte';

	interface Photo {
		slug: string;
		title: string;
		image: string;
	}

	interface GridItem {
		slug: string;
		title: string;
		processedPath: string;
		baseUrl: string;
	}

	interface PageData {
		photos: Photo[];
	}

	export let data: PageData;
	let loading = true;
	let error: Error | null = null;
	let gridItems: GridItem[] = [];
	let isPinterestStyle = true;

	onMount(async () => {
		try {
			gridItems = await Promise.all(
				data.photos.map(async (photo: Photo) => ({
					slug: photo.slug,
					title: photo.title,
					processedPath: await getProcessedImagePath(photo.image, 'thumbnail'),
					baseUrl: '/photos'
				}))
			);
		} catch (e) {
			error = e instanceof Error ? e : new Error('Failed to load images');
		} finally {
			loading = false;
		}
	});
</script>

<DefaultPage title="Photos">
	<PhotoGrid items={gridItems} {loading} {error} itemType="photo" {isPinterestStyle} />
</DefaultPage>
