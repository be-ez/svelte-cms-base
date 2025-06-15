/**
 * Single source of truth for image processing configuration
 * Used by both the image pipeline and frontend components
 */

export const IMAGE_SIZES = {
	thumbnail: {
		width: 400,
		name: 'thumbnail',
		description: 'Small preview images for grids'
	},
	small: {
		width: 800,
		name: 'small',
		description: 'Mobile and small screens'
	},
	medium: {
		width: 1200,
		name: 'medium',
		description: 'Tablets and medium screens'
	},
	large: {
		width: 1800,
		name: 'large',
		description: 'Desktop screens'
	},
	display: {
		width: 2400,
		name: 'display',
		description: 'High resolution displays'
	},
	original: {
		width: null,
		name: 'original',
		description: 'Original image size'
	}
} as const;

export const IMAGE_FORMATS = {
	webp: {
		extension: 'webp',
		mimeType: 'image/webp',
		quality: 80,
		options: {
			effort: 4
		}
	},
	jpg: {
		extension: 'jpg',
		mimeType: 'image/jpeg',
		quality: 80,
		options: {
			mozjpeg: true
		}
	}
} as const;

// Type exports
export type ImageSizeKey = keyof typeof IMAGE_SIZES;
export type ImageFormatKey = keyof typeof IMAGE_FORMATS;

// Helper to get size configuration
export function getImageSize(size: ImageSizeKey) {
	return IMAGE_SIZES[size];
}

// Helper to get format configuration
export function getImageFormat(format: ImageFormatKey) {
	return IMAGE_FORMATS[format];
}

// Generate filename for processed image
export function generateProcessedFilename(
	originalId: string,
	size: ImageSizeKey,
	format: ImageFormatKey
): string {
	return `${originalId}-${size}.${IMAGE_FORMATS[format].extension}`;
}

// Get responsive sizes attribute for HTML
export function getResponsiveSizes(): string {
	const breakpoints = [
		`(max-width: ${IMAGE_SIZES.thumbnail.width}px) ${IMAGE_SIZES.thumbnail.width}px`,
		`(max-width: ${IMAGE_SIZES.small.width}px) ${IMAGE_SIZES.small.width}px`,
		`(max-width: ${IMAGE_SIZES.medium.width}px) ${IMAGE_SIZES.medium.width}px`,
		`(max-width: ${IMAGE_SIZES.large.width}px) ${IMAGE_SIZES.large.width}px`,
		`${IMAGE_SIZES.display.width}px`
	];
	return breakpoints.join(', ');
}

// Manifest structure that matches what image-pipeline generates
export interface ProcessedImage {
	originalPath: string;
	metadata: {
		width: number;
		height: number;
		aspectRatio: number;
	};
	sizes: {
		[K in ImageSizeKey]: {
			[F in ImageFormatKey]: string;
		};
	};
}

// Enhanced type with methods for frontend use
export interface ProcessedImageData {
	id: string;
	originalUrl: string;
	metadata: {
		width: number;
		height: number;
		aspectRatio: number;
	};
	sizes: {
		[K in ImageSizeKey]: {
			[F in ImageFormatKey]: {
				url: string;
				width: number | null;
			};
		};
	};
	getSrcSet: (format: ImageFormatKey) => string;
	getSizes: () => string;
	getUrl: (size: ImageSizeKey, format: ImageFormatKey) => string;
}
