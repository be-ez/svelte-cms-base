import { browser } from '$app/environment';

import 'inter-ui/inter-display-latin.css';

export const load = () => {
	if (browser) {
		const storedTheme = localStorage.getItem('theme') || 'light';
		document.documentElement.setAttribute('data-theme', storedTheme);
		// Theme is now handled by CSS classes in app.html - no reset needed
	}
	return {};
};

export const prerender = true;
