import 'inter-ui/inter-display-latin.css';
import { theme } from '$lib/stores/theme';
import { browser } from '$app/environment';

export const load = () => {
	if (browser) {
		const storedTheme = localStorage.getItem('theme') || 'light';
		document.documentElement.setAttribute('data-theme', storedTheme);
		theme.reset();
	}
	return {};
};

export const prerender = true;
