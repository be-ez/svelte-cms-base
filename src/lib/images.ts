// Re-export from the new centralized service
export type { ImageFormatKey as ImageFormat, ImageSizeKey as ImageSize } from '$lib/image-config';
export { getProcessedImageUrl as getProcessedImagePath } from '$lib/services/ImageService';
