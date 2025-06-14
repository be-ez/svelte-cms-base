import { writable } from 'svelte/store';

import { browser } from '$app/environment';

import { darkTheme, lightTheme, type ThemeConfig } from '../theme/config';

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

function createThemeStore() {
	const { subscribe, set, update } = writable<ThemeConfig>(lightTheme);

	// Initialize theme based on stored preference (if not already set by app.html)
	if (browser) {
		const isDark = document.documentElement.classList.contains('dark');
		// Only update CSS variables, classes and localStorage are handled by app.html
		updateCssVariables(isDark ? darkTheme : lightTheme);
		// Sync the isDarkMode store
		isDarkMode.set(isDark);
	}

	// Subscribe to dark mode changes
	if (browser) {
		isDarkMode.subscribe(isDark => {
			const newTheme = isDark ? darkTheme : lightTheme;
			set(newTheme);
			updateCssVariables(newTheme);
		});
	}

	return {
		subscribe,
		update: (newTheme: Partial<ThemeConfig>) => {
			update(theme => ({ ...theme, ...newTheme }));
			if (browser) {
				updateCssVariables(newTheme);
			}
		},
		reset: () => {
			const defaultTheme =
				browser && localStorage.getItem('theme') === 'dark' ? darkTheme : lightTheme;
			set(defaultTheme);
			if (browser) {
				updateCssVariables(defaultTheme);
			}
		}
	};
}

function updateCssVariables(theme: Partial<ThemeConfig>) {
	if (!browser) return;

	const root = document.documentElement;

	if (theme.colors) {
		// Set main colors
		Object.entries(theme.colors).forEach(([key, value]) => {
			if (typeof value === 'string') {
				root.style.setProperty(`--color-${key}`, value);
				// Also set background-color for the main background
				if (key === 'background') {
					root.style.setProperty('--background-color', value);
				}
			} else if (key === 'gray' && typeof value === 'object') {
				// Handle nested gray colors
				Object.entries(value).forEach(([shade, color]) => {
					root.style.setProperty(`--color-gray-${shade}`, color);
				});
			}
		});
	}

	if (theme.fonts) {
		root.style.setProperty('--font-primary', theme.fonts.primary);
		if (theme.fonts.weights) {
			Object.entries(theme.fonts.weights).forEach(([key, value]) => {
				root.style.setProperty(`--font-weight-${key}`, value);
			});
		}
	}
}

export const theme = createThemeStore();
