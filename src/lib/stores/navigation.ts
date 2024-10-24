import { writable } from 'svelte/store';

export const pageTitle = writable('');
export const pageSubtitle = writable('');
export const showBackButton = writable(false);
