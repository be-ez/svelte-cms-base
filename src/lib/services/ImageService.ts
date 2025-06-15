import {
	getResponsiveSizes,
	IMAGE_FORMATS,
	IMAGE_SIZES,
	type ImageFormatKey,
	type ImageSizeKey,
	type ProcessedImage,
	type ProcessedImageData
} from '$lib/image-config';

/**
 * Centralized service for all image operations
 * Handles manifest loading, caching, and provides a clean API for image data
 */
export class ImageService {
	private static instance: ImageService | null = null;
	private manifest: Record<string, ProcessedImage> | null = null;
	private manifestPromise: Promise<void> | null = null;
	private isLoading = false;
	private loadError: Error | null = null;

	// Singleton pattern to ensure one instance across the app
	static getInstance(): ImageService {
		if (!ImageService.instance) {
			ImageService.instance = new ImageService();
		}
		return ImageService.instance;
	}

	private constructor() {
		// Private constructor for singleton
	}

	/**
	 * Load the image manifest from the static file
	 */
	private async loadManifest(): Promise<void> {
		if (this.manifest !== null) return; // Already loaded

		this.isLoading = true;
		this.loadError = null;

		try {
			const response = await fetch('/image-manifest.json');
			if (!response.ok) {
				throw new Error(`Failed to load image manifest: ${response.status}`);
			}

			const rawManifest = await response.json();

			// Filter out placeholder entries
			const cleanManifest: Record<string, ProcessedImage> = {};
			Object.entries(rawManifest).forEach(([key, value]) => {
				if (key !== '__placeholder__') {
					cleanManifest[key] = value as ProcessedImage;
				}
			});

			this.manifest = cleanManifest;
		} catch (error) {
			this.loadError = error instanceof Error ? error : new Error('Unknown error loading manifest');
			this.manifest = {}; // Empty manifest as fallback
			console.error('Failed to load image manifest:', error);
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Ensure manifest is loaded, returns a promise that resolves when ready
	 */
	private async ensureManifestLoaded(): Promise<void> {
		if (!this.manifestPromise) {
			this.manifestPromise = this.loadManifest();
		}
		return this.manifestPromise;
	}

	/**
	 * Convert raw manifest data to enhanced ProcessedImageData
	 */
	private createProcessedImageData(id: string, raw: ProcessedImage): ProcessedImageData {
		const processedSizes: ProcessedImageData['sizes'] = {} as ProcessedImageData['sizes'];

		// Build the sizes object with full metadata
		for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES) as [
			ImageSizeKey,
			(typeof IMAGE_SIZES)[ImageSizeKey]
		][]) {
			processedSizes[sizeName] = {} as ProcessedImageData['sizes'][ImageSizeKey];
			for (const formatName of Object.keys(IMAGE_FORMATS) as ImageFormatKey[]) {
				const filename = raw.sizes[sizeName][formatName];
				processedSizes[sizeName][formatName] = {
					url: `/images/processed/${filename}`,
					width: sizeConfig.width
				};
			}
		}

		return {
			id,
			originalUrl: raw.originalPath,
			metadata: raw.metadata || {
				width: 0,
				height: 0,
				aspectRatio: 1
			},
			sizes: processedSizes,
			getSrcSet(format: ImageFormatKey) {
				return Object.entries(IMAGE_SIZES)
					.filter(([name]) => name !== 'original')
					.map(([name, _config]) => {
						const { url, width } = this.sizes[name as ImageSizeKey][format];
						return width ? `${url} ${width}w` : '';
					})
					.filter(Boolean)
					.join(', ');
			},
			getSizes() {
				return getResponsiveSizes();
			},
			getUrl(size: ImageSizeKey, format: ImageFormatKey) {
				return this.sizes[size][format].url;
			}
		};
	}

	/**
	 * Get a single processed image by ID
	 */
	async getImage(imageId: string): Promise<ProcessedImageData | null> {
		await this.ensureManifestLoaded();

		if (!this.manifest || this.loadError) {
			return null;
		}

		const rawImage = this.manifest[imageId];
		if (!rawImage) {
			return null;
		}

		return this.createProcessedImageData(imageId, rawImage);
	}

	/**
	 * Get multiple processed images by IDs
	 */
	async getImages(imageIds: string[]): Promise<Map<string, ProcessedImageData>> {
		await this.ensureManifestLoaded();

		const result = new Map<string, ProcessedImageData>();

		if (!this.manifest || this.loadError) {
			return result;
		}

		imageIds.forEach(id => {
			const rawImage = this.manifest![id];
			if (rawImage) {
				result.set(id, this.createProcessedImageData(id, rawImage));
			}
		});

		return result;
	}

	/**
	 * Get all available processed images
	 */
	async getAllImages(): Promise<Map<string, ProcessedImageData>> {
		await this.ensureManifestLoaded();

		const result = new Map<string, ProcessedImageData>();

		if (!this.manifest || this.loadError) {
			return result;
		}

		Object.entries(this.manifest).forEach(([id, rawImage]) => {
			result.set(id, this.createProcessedImageData(id, rawImage));
		});

		return result;
	}

	/**
	 * Get a direct URL for a specific image size and format
	 */
	async getImageUrl(
		imageId: string,
		size: ImageSizeKey = 'display',
		format: ImageFormatKey = 'webp'
	): Promise<string> {
		const image = await this.getImage(imageId);
		if (!image) {
			// Fallback to original asset
			return `/assets/${imageId}`;
		}
		return image.getUrl(size, format);
	}

	/**
	 * Check if an image exists in the manifest
	 */
	async hasImage(imageId: string): Promise<boolean> {
		await this.ensureManifestLoaded();
		return this.manifest ? imageId in this.manifest : false;
	}

	/**
	 * Get loading state
	 */
	get loading(): boolean {
		return this.isLoading;
	}

	/**
	 * Get error state
	 */
	get error(): Error | null {
		return this.loadError;
	}

	/**
	 * Check if manifest is loaded
	 */
	get isLoaded(): boolean {
		return this.manifest !== null;
	}

	/**
	 * Get all available image IDs
	 */
	async getImageIds(): Promise<string[]> {
		await this.ensureManifestLoaded();
		return this.manifest ? Object.keys(this.manifest) : [];
	}

	/**
	 * Preload specific images (useful for critical images)
	 */
	async preloadImages(imageIds: string[]): Promise<void> {
		const images = await this.getImages(imageIds);

		// Create link elements to preload the images
		images.forEach(imageData => {
			// Preload WebP version for modern browsers
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = imageData.getUrl('small', 'webp');
			document.head.appendChild(link);
		});
	}

	/**
	 * Clear the manifest cache (useful for testing or forced refresh)
	 */
	clearCache(): void {
		this.manifest = null;
		this.manifestPromise = null;
		this.loadError = null;
		this.isLoading = false;
	}
}

// Export a singleton instance for easy use
export const imageService = ImageService.getInstance();

// Export helper functions that use the service
export const getProcessedImage = (imageId: string) => imageService.getImage(imageId);
export const getProcessedImages = (imageIds: string[]) => imageService.getImages(imageIds);
export const getProcessedImageUrl = (
	imageId: string,
	size?: ImageSizeKey,
	format?: ImageFormatKey
) => imageService.getImageUrl(imageId, size, format);
