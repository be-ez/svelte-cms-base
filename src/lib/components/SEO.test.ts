import { describe, expect, it } from 'vitest';

describe('SEO Component', () => {
	it('should import without errors', async () => {
		// Simple import test to verify the component is valid
		const module = await import('./SEO.svelte');
		expect(module).toBeDefined();
		expect(module.default).toBeDefined();
	});
});
