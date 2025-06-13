import { readable } from 'svelte/store';

import type { ProcessedImageData } from '$lib/image-config';
import { imageService } from '$lib/services/ImageService';

// Create reactive stores based on the ImageService
export const imagesLoading = readable(false, set => {
	// Poll the service loading state
	const interval = setInterval(() => {
		set(imageService.loading);
	}, 100);

	return () => clearInterval(interval);
});

export const imagesError = readable<Error | null>(null, set => {
	// Poll the service error state
	const interval = setInterval(() => {
		set(imageService.error);
	}, 100);

	return () => clearInterval(interval);
});

// Re-export service functions for backwards compatibility
export const getProcessedImage = (imageId: string) => imageService.getImage(imageId);
export const getProcessedImages = (imageIds: string[]) => imageService.getImages(imageIds);
export const getProcessedImageUrl = (
	imageId: string,
	size?: Parameters<typeof imageService.getImageUrl>[1],
	format?: Parameters<typeof imageService.getImageUrl>[2]
) => imageService.getImageUrl(imageId, size, format);

// Export service instance for direct access
export { imageService };

// Export types
export type { ProcessedImageData };
