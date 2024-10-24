import { writable } from 'svelte/store';
import { lightTheme, darkTheme, type ThemeConfig } from '../theme/config';
import { browser } from '$app/environment';

// Create a store for dark mode preference
export const isDarkMode = {
	...writable(browser ? localStorage.getItem('theme') === 'dark' : false),
	toggle: function () {
		this.update((n) => {
			const newValue = !n;
			if (browser) {
				const newTheme = newValue ? 'dark' : 'light';
				localStorage.setItem('theme', newTheme);
				document.documentElement.setAttribute('data-theme', newTheme);
			}
			return newValue;
		});
	}
};

function createThemeStore() {
	const { subscribe, set, update } = writable<ThemeConfig>(lightTheme);

	// Initialize theme based on stored preference
	if (browser) {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme === 'dark') {
			updateCssVariables(darkTheme);
		} else {
			updateCssVariables(lightTheme);
		}
	}

	// Subscribe to dark mode changes
	if (browser) {
		isDarkMode.subscribe((isDark) => {
			const newTheme = isDark ? darkTheme : lightTheme;
			set(newTheme);
			updateCssVariables(newTheme);
		});
	}

	return {
		subscribe,
		update: (newTheme: Partial<ThemeConfig>) => {
			update((theme) => ({ ...theme, ...newTheme }));
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
