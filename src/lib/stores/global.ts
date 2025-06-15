import { writable } from 'svelte/store';

export interface GlobalSettings {
	id: number;
	Title: string;
	Description: string;
	site_url: string;
	default_og_image: string | null;
	author_name: string;
	Homepage_Content: string;
	navigation_menu: Array<{
		name: string;
		icon: string;
		href: string;
	}> | null;
	contact_email: string | null;
	social_github: string | null;
	social_linkedin: string | null;
	social_instagram: string | null;
	analytics_domain: string | null;
	analytics_server: string | null;
}

export const globalSettings = writable<GlobalSettings | null>(null);
