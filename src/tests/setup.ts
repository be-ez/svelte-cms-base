import '@testing-library/jest-dom';

import { vi } from 'vitest';

// Mock SvelteKit modules
vi.mock('$app/environment', () => ({
	browser: false,
	dev: true,
	building: false,
	version: 'test'
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	prefetch: vi.fn(),
	prefetchRoutes: vi.fn()
}));

vi.mock('$app/stores', () => {
	const readable = (value: any) => ({
		subscribe: vi.fn(fn => {
			fn(value);
			return vi.fn();
		})
	});

	return {
		page: readable({
			url: new URL('http://localhost'),
			params: {},
			route: { id: '/' }
		}),
		navigating: readable(null),
		updated: readable(false)
	};
});

// Mock environment variables
vi.mock('$env/static/private', () => ({
	DIRECTUS_API_URL: 'http://localhost:8055',
	DIRECTUS_TOKEN: 'test-token'
}));
