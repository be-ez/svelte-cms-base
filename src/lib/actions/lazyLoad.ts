import type { LazyLoadOptions } from '$lib/utils/intersectionObserver';
import { lazyLoad as createLazyLoadAction } from '$lib/utils/intersectionObserver';

/**
 * Svelte action for lazy loading images
 * Usage: <img use:lazyLoad={{ src: '/path/to/image.jpg' }} />
 */
export interface LazyLoadActionOptions extends Omit<LazyLoadOptions, 'onEnter'> {
	src?: string;
	srcset?: string;
	onLoad?: () => void;
	onError?: (error: Event) => void;
	enableBlurUp?: boolean;
	blurSrc?: string;
}

export function lazyLoad(element: HTMLImageElement, options: LazyLoadActionOptions = {}) {
	const {
		src,
		srcset,
		onLoad,
		onError,
		enableBlurUp = false,
		blurSrc,
		...observerOptions
	} = options;

	let isLoaded = false;
	let blurPlaceholder: HTMLImageElement | null = null;

	// Create blur placeholder if enabled
	if (enableBlurUp && blurSrc) {
		blurPlaceholder = document.createElement('img');
		blurPlaceholder.src = blurSrc;
		blurPlaceholder.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			filter: blur(10px);
			transform: scale(1.1);
			z-index: 1;
		`;

		// Insert blur placeholder before the main image
		element.parentNode?.insertBefore(blurPlaceholder, element);

		// Style the main image for overlay
		element.style.position = 'relative';
		element.style.zIndex = '2';
		element.style.opacity = '0';
		element.style.transition = 'opacity 0.3s ease-in-out';
	}

	function loadImage() {
		if (isLoaded) return;
		isLoaded = true;

		// Set the actual src and srcset
		if (src) element.src = src;
		if (srcset) element.srcset = srcset;

		// Handle load event
		const handleLoad = () => {
			element.style.opacity = '1';
			if (blurPlaceholder) {
				blurPlaceholder.style.opacity = '0';
				setTimeout(() => {
					blurPlaceholder?.remove();
				}, 300);
			}
			onLoad?.();
		};

		// Handle error event
		const handleError = (event: Event) => {
			if (blurPlaceholder) {
				blurPlaceholder.remove();
			}
			onError?.(event);
		};

		element.addEventListener('load', handleLoad, { once: true });
		element.addEventListener('error', handleError, { once: true });
	}

	// Set up intersection observer
	const action = createLazyLoadAction(element, {
		...observerOptions,
		onEnter: loadImage
	});

	return {
		update(newOptions: LazyLoadActionOptions) {
			Object.assign(options, newOptions);
		},
		destroy() {
			action.destroy();
			if (blurPlaceholder) {
				blurPlaceholder.remove();
			}
		}
	};
}

/**
 * Simple lazy loading action without blur-up
 * Usage: <img use:simpleLazyLoad="/path/to/image.jpg" />
 */
export function simpleLazyLoad(element: HTMLImageElement, src: string) {
	return lazyLoad(element, { src });
}
