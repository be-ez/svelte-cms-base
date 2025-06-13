/**
 * Enhanced intersection observer utilities for lazy loading
 */

export interface IntersectionObserverOptions {
	rootMargin?: string;
	threshold?: number | number[];
	root?: Element | null;
}

export interface LazyLoadOptions extends IntersectionObserverOptions {
	onEnter?: (entry: IntersectionObserverEntry) => void;
	onExit?: (entry: IntersectionObserverEntry) => void;
	once?: boolean; // If true, only triggers once
}

/**
 * Create a reusable intersection observer
 */
export function createIntersectionObserver(
	callback: IntersectionObserverCallback,
	options: IntersectionObserverOptions = {}
): IntersectionObserver {
	const defaultOptions: IntersectionObserverOptions = {
		rootMargin: '50px', // Start loading 50px before entering viewport
		threshold: 0.1,
		...options
	};

	return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Lazy loading utility with intersection observer
 */
export function createLazyLoader(options: LazyLoadOptions = {}) {
	const { onEnter, onExit, once = true, ...observerOptions } = options;

	const observedElements = new WeakSet<Element>();

	const observer = createIntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				onEnter?.(entry);
				if (once) {
					observer.unobserve(entry.target);
				}
			} else {
				onExit?.(entry);
			}
		});
	}, observerOptions);

	return {
		observe(element: Element) {
			if (observedElements.has(element)) return;
			observer.observe(element);
			observedElements.add(element);
		},
		unobserve(element: Element) {
			observer.unobserve(element);
			observedElements.delete(element);
		},
		disconnect() {
			observer.disconnect();
			// WeakSet doesn't have a clear method, no need to clear it
		}
	};
}

/**
 * Action for Svelte use:lazyLoad
 */
export function lazyLoad(element: Element, options: LazyLoadOptions = {}) {
	const loader = createLazyLoader(options);
	loader.observe(element);

	return {
		destroy() {
			loader.unobserve(element);
		}
	};
}

/**
 * Preload critical images that are about to enter viewport
 */
export function createImagePreloader(rootMargin = '200px') {
	return createLazyLoader({
		rootMargin,
		threshold: 0,
		once: true,
		onEnter: entry => {
			const img = entry.target as HTMLImageElement;
			if (img.dataset.src) {
				// Create preload link
				const link = document.createElement('link');
				link.rel = 'preload';
				link.as = 'image';
				link.href = img.dataset.src;
				document.head.appendChild(link);
			}
		}
	});
}

/**
 * Check if intersection observer is supported
 */
export function isIntersectionObserverSupported(): boolean {
	return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}
