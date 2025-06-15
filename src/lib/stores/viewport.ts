import { derived, readable } from 'svelte/store';

import { browser } from '$app/environment';
import type { ImageSizeKey } from '$lib/image-config';

// Centralized breakpoint definitions
export const BREAKPOINTS = {
	mobile: 640,
	tablet: 768,
	laptop: 1024,
	desktop: 1280,
	wide: 1536
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// Viewport dimensions store
export const viewport = readable({ width: 0, height: 0 }, set => {
	if (!browser) {
		// SSR fallback - assume mobile for safety
		set({ width: 375, height: 667 });
		return;
	}

	const update = () => {
		set({
			width: window.innerWidth,
			height: window.innerHeight
		});
	};

	// Initial value
	update();

	// Listen for changes
	window.addEventListener('resize', update);
	window.addEventListener('orientationchange', update);

	return () => {
		window.removeEventListener('resize', update);
		window.removeEventListener('orientationchange', update);
	};
});

// Derived stores for common breakpoint queries
export const isMobile = derived(viewport, $viewport => $viewport.width < BREAKPOINTS.tablet);
export const isTablet = derived(
	viewport,
	$viewport => $viewport.width >= BREAKPOINTS.tablet && $viewport.width < BREAKPOINTS.laptop
);
export const isLaptop = derived(
	viewport,
	$viewport => $viewport.width >= BREAKPOINTS.laptop && $viewport.width < BREAKPOINTS.desktop
);
export const isDesktop = derived(viewport, $viewport => $viewport.width >= BREAKPOINTS.desktop);

// More specific queries
export const isMobileOrTablet = derived(
	viewport,
	$viewport => $viewport.width < BREAKPOINTS.laptop
);
export const isLaptopOrDesktop = derived(
	viewport,
	$viewport => $viewport.width >= BREAKPOINTS.laptop
);

// Current breakpoint name
export const currentBreakpoint = derived(viewport, ($viewport): BreakpointKey => {
	const { width } = $viewport;
	if (width < BREAKPOINTS.tablet) return 'mobile';
	if (width < BREAKPOINTS.laptop) return 'tablet';
	if (width < BREAKPOINTS.desktop) return 'laptop';
	if (width < BREAKPOINTS.wide) return 'desktop';
	return 'wide';
});

// Utility function for custom breakpoint checks
export const isAboveBreakpoint = (breakpoint: BreakpointKey) =>
	derived(viewport, $viewport => $viewport.width >= BREAKPOINTS[breakpoint]);

export const isBelowBreakpoint = (breakpoint: BreakpointKey) =>
	derived(viewport, $viewport => $viewport.width < BREAKPOINTS[breakpoint]);

// Image quality helpers
export const getOptimalImageSize = derived(viewport, ($viewport): ImageSizeKey => {
	const { width } = $viewport;

	// Mobile: Use thumbnail for fast loading
	if (width < BREAKPOINTS.tablet) return 'thumbnail';

	// Tablet: Use small for better quality
	if (width < BREAKPOINTS.laptop) return 'small';

	// Laptop and above: Use medium for high quality
	return 'medium';
});

// Gallery-specific image sizing (can be different from general use)
export const getGalleryImageSize = derived(viewport, ($viewport): ImageSizeKey => {
	const { width } = $viewport;

	// Mobile: thumbnail (400px) for speed
	if (width < BREAKPOINTS.tablet) return 'thumbnail';

	// Desktop: small (800px) for quality without being excessive
	return 'small';
});
