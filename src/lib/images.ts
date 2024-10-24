// Define the manifest type
interface ImageSizes {
	thumbnail: { width: number };
	small: { width: number };
	medium: { width: number };
	large: { width: number };
	display: { width: number };
	original: null;
}

interface ProcessedImage {
	originalPath: string;
	sizes: {
		[K in keyof ImageSizes]: {
			webp: string;
			jpg: string;
		};
	};
}

type ImageManifest = Record<string, ProcessedImage>;

// Function to load manifest
async function loadManifest(): Promise<ImageManifest> {
	try {
		const manifestModule = await import('./image-manifest.json');
		return manifestModule.default;
	} catch {
		console.warn('Image manifest not found - will be generated during build');
		return {};
	}
}

let manifestPromise: Promise<ImageManifest> | null = null;

export async function getProcessedImagePath(
	imageId: string,
	size: ImageSize = 'display',
	format: ImageFormat = 'webp'
): Promise<string> {
	// Initialize manifest loading if not started
	if (!manifestPromise) {
		manifestPromise = loadManifest();
	}

	// Wait for manifest to load
	const manifest = await manifestPromise;
	const image = manifest[imageId];

	if (!image) {
		// Fallback to original asset path if manifest entry doesn't exist
		return `/assets/${imageId}`;
	}

	const filename = image.sizes[size][format];
	return `/images/processed/${filename}`;
}

type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'display' | 'original';
type ImageFormat = 'webp' | 'jpg';
