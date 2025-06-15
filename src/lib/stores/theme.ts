import { writable } from 'svelte/store';

import { browser } from '$app/environment';

// Create a store for dark mode preference
function createDarkModeStore() {
	// Check if dark class is already set (from app.html)
	const initialValue = browser
		? document.documentElement.classList.contains('dark') ||
			localStorage.getItem('theme') === 'dark'
		: false;

	const { subscribe, set, update } = writable(initialValue);

	return {
		subscribe,
		toggle: function () {
			update(n => {
				const newValue = !n;
				if (browser) {
					const newTheme = newValue ? 'dark' : 'light';
					localStorage.setItem('theme', newTheme);
					// Mark as manually set to prevent auto-updates for a while
					localStorage.setItem('theme-manual-timestamp', Date.now().toString());
					document.documentElement.classList.toggle('dark', newValue);
				}
				return newValue;
			});
		},
		set
	};
}

export const isDarkMode = createDarkModeStore();

// Listen for system theme changes and update if user hasn't manually set a preference
if (browser) {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	mediaQuery.addEventListener('change', e => {
		// Only auto-update if the user hasn't manually set a preference recently
		// We'll consider a preference "manual" if it was set in the last hour
		const lastManualSet = localStorage.getItem('theme-manual-timestamp');
		const oneHourAgo = Date.now() - 60 * 60 * 1000;

		if (!lastManualSet || parseInt(lastManualSet) < oneHourAgo) {
			const newTheme = e.matches ? 'dark' : 'light';
			localStorage.setItem('theme', newTheme);
			isDarkMode.set(e.matches);
		}
	});
}

// Simplified theme store since CSS variables are now handled by app.css
export const theme = {
	// This can be used for any future theme-related state
	// All styling is now handled by CSS custom properties
};
