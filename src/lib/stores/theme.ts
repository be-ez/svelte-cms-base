import { writable } from 'svelte/store';

import { browser } from '$app/environment';

import { darkTheme, lightTheme, type ThemeConfig } from '../theme/config';

// Create a store for dark mode preference
function createDarkModeStore() {
	const { subscribe, set, update } = writable(
		browser ? localStorage.getItem('theme') === 'dark' : false
	);

	return {
		subscribe,
		toggle: function () {
			update(n => {
				const newValue = !n;
				if (browser) {
					const newTheme = newValue ? 'dark' : 'light';
					localStorage.setItem('theme', newTheme);
					document.documentElement.classList.toggle('dark', newValue);
				}
				return newValue;
			});
		},
		set
	};
}

export const isDarkMode = createDarkModeStore();

function createThemeStore() {
	const { subscribe, set, update } = writable<ThemeConfig>(lightTheme);

	// Initialize theme based on stored preference
	if (browser) {
		const storedTheme = localStorage.getItem('theme');
		const isDark = storedTheme === 'dark';
		if (isDark) {
			document.documentElement.classList.add('dark');
			updateCssVariables(darkTheme);
		} else {
			document.documentElement.classList.remove('dark');
			updateCssVariables(lightTheme);
		}
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
