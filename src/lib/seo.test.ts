import { describe, expect, it } from 'vitest';

import { generateJSONLD, generateMetaTags } from './seo';

describe('SEO utilities', () => {
	describe('generateMetaTags', () => {
		it('should generate basic meta tags', () => {
			const config = {
				title: 'Test Page',
				description: 'Test description'
			};

			const tags = generateMetaTags(config);

			expect(tags.title).toBe('Test Page');
			expect(tags.description).toBe('Test description');
			expect(tags['og:title']).toBe('Test Page');
			expect(tags['og:description']).toBe('Test description');
			expect(tags['og:type']).toBe('website');
			expect(tags['twitter:card']).toBe('summary');
		});

		it('should generate article meta tags', () => {
			const config = {
				title: 'Test Article',
				description: 'Test article description',
				article: {
					publishedTime: '2024-01-01T00:00:00Z',
					modifiedTime: '2024-01-02T00:00:00Z',
					author: 'John Doe',
					tags: ['tag1', 'tag2']
				}
			};

			const tags = generateMetaTags(config);

			expect(tags['og:type']).toBe('article');
			expect(tags['article:published_time']).toBe('2024-01-01T00:00:00Z');
			expect(tags['article:modified_time']).toBe('2024-01-02T00:00:00Z');
			expect(tags['article:author']).toBe('John Doe');
			expect(tags['article:tag']).toBe('tag1,tag2');
		});

		it('should include image meta tags when image is provided', () => {
			const config = {
				title: 'Test with Image',
				description: 'Test description',
				image: 'https://example.com/image.jpg'
			};

			const tags = generateMetaTags(config);

			expect(tags['og:image']).toBe('https://example.com/image.jpg');
			expect(tags['og:image:alt']).toBe('Test with Image');
			expect(tags['twitter:card']).toBe('summary_large_image');
			expect(tags['twitter:image']).toBe('https://example.com/image.jpg');
		});
	});

	describe('generateJSONLD', () => {
		it('should generate basic webpage schema', () => {
			const config = {
				title: 'Test Page',
				description: 'Test description',
				url: 'https://example.com/test'
			};

			const jsonLD = generateJSONLD(config);

			expect(jsonLD['@context']).toBe('https://schema.org');
			expect(jsonLD['@type']).toBe('WebPage');
			expect(jsonLD.name).toBe('Test Page');
			expect(jsonLD.description).toBe('Test description');
			expect(jsonLD.url).toBe('https://example.com/test');
		});

		it('should generate article schema', () => {
			const config = {
				title: 'Test Article',
				description: 'Test article description',
				type: 'Article',
				article: {
					publishedTime: '2024-01-01T00:00:00Z',
					modifiedTime: '2024-01-02T00:00:00Z',
					author: 'John Doe',
					tags: ['tag1', 'tag2']
				}
			};

			const jsonLD = generateJSONLD(config);

			expect(jsonLD['@type']).toBe('BlogPosting');
			expect(jsonLD.datePublished).toBe('2024-01-01T00:00:00Z');
			expect(jsonLD.dateModified).toBe('2024-01-02T00:00:00Z');
			expect(jsonLD.author).toEqual({
				'@type': 'Person',
				name: 'John Doe'
			});
			expect(jsonLD.keywords).toBe('tag1, tag2');
		});
	});
});
