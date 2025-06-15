import { globalSettings } from '$lib/stores/global';
import { get } from 'svelte/store';

export function initializeAnalytics() {
	const settings = get(globalSettings);
	
	if (!settings?.analytics_domain || !settings?.analytics_server) {
		console.info('Analytics not configured in global settings');
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
		window.plausible = window.plausible || function() { 
			(window.plausible.q = window.plausible.q || []).push(arguments);
		};
	}

	document.head.appendChild(script);
}

// Type declaration for TypeScript
declare global {
	interface Window {
		plausible: any;
	}
}