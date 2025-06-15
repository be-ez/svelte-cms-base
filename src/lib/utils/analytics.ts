import { get } from 'svelte/store';

import { globalSettings } from '$lib/stores/global';

export function initializeAnalytics() {
	const settings = get(globalSettings);

	if (!settings?.analytics_domain || !settings?.analytics_server) {
		return;
	}

	// Check if analytics script is already loaded
	if (document.querySelector('[data-domain]')) {
		return;
	}

	// Create and load Plausible analytics script
	const script = document.createElement('script');
	script.defer = true;
	script.setAttribute('data-domain', settings.analytics_domain);
	script.src = `https://${settings.analytics_server}/js/script.js`;

	// Add Plausible global function
	if (!window.plausible) {
		const plausibleFn = function (...args: unknown[]) {
			(plausibleFn.q = plausibleFn.q || []).push(args);
		} as any;
		plausibleFn.q = [];
		window.plausible = plausibleFn;
	}

	document.head.appendChild(script);
}

// Type declaration for TypeScript
declare global {
	interface Window {
		plausible: any;
	}
}
