export interface SEOConfig {
	title: string;
	description: string;
	url?: string;
	image?: string;
	article?: {
		publishedTime?: string;
		modifiedTime?: string;
		author?: string;
		tags?: string[];
	};
}

export function generateMetaTags(config: SEOConfig): Record<string, string> {
	const tags: Record<string, string> = {
		title: config.title,
		description: config.description
	};

	// Open Graph tags
	tags['og:title'] = config.title;
	tags['og:description'] = config.description;
	tags['og:type'] = config.article ? 'article' : 'website';

	if (config.url) {
		tags['og:url'] = config.url;
		tags['canonical'] = config.url;
	}

	if (config.image) {
		tags['og:image'] = config.image;
		tags['og:image:alt'] = config.title;
	}

	// Twitter Card tags
	tags['twitter:card'] = config.image ? 'summary_large_image' : 'summary';
	tags['twitter:title'] = config.title;
	tags['twitter:description'] = config.description;

	if (config.image) {
		tags['twitter:image'] = config.image;
		tags['twitter:image:alt'] = config.title;
	}

	// Article specific tags
	if (config.article) {
		if (config.article.publishedTime) {
			tags['article:published_time'] = config.article.publishedTime;
		}
		if (config.article.modifiedTime) {
			tags['article:modified_time'] = config.article.modifiedTime;
		}
		if (config.article.author) {
			tags['article:author'] = config.article.author;
		}
		if (config.article.tags && config.article.tags.length > 0) {
			tags['article:tag'] = config.article.tags.join(',');
		}
	}

	return tags;
}

export function generateJSONLD(config: SEOConfig & { type?: string }) {
	const baseSchema: any = {
		'@context': 'https://schema.org',
		'@type': config.type || 'WebPage',
		name: config.title,
		description: config.description
	};

	if (config.url) {
		baseSchema.url = config.url;
	}

	if (config.image) {
		baseSchema.image = config.image;
	}

	if (config.article && config.type === 'Article') {
		baseSchema['@type'] = 'BlogPosting';
		if (config.article.publishedTime) {
			baseSchema.datePublished = config.article.publishedTime;
		}
		if (config.article.modifiedTime) {
			baseSchema.dateModified = config.article.modifiedTime;
		}
		if (config.article.author) {
			baseSchema.author = {
				'@type': 'Person',
				name: config.article.author
			};
		}
		if (config.article.tags && config.article.tags.length > 0) {
			baseSchema.keywords = config.article.tags.join(', ');
		}
	}

	return baseSchema;
}
