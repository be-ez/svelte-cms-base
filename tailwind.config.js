import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundColor: {
				page: 'var(--color-background)',
				surface: 'var(--color-gray-100)',
				'surface-hover': 'var(--color-gray-200)',
				'subtle-hover': 'var(--color-hoverSubtle)'
			},
			textColor: {
				default: 'var(--color-primary)',
				muted: 'var(--color-secondary)',
				subtle: 'var(--color-tertiary)',
				accent: 'var(--color-accent)'
			},
			borderColor: {
				default: 'var(--color-border)'
			},
			fontFamily: {
				inter: ['var(--font-primary)', 'sans-serif']
			},
			colors: {
				gray: {
					100: 'var(--color-gray-100)',
					200: 'var(--color-gray-200)',
					300: 'var(--color-gray-300)',
					500: 'var(--color-gray-500)',
					600: 'var(--color-gray-600)',
					700: 'var(--color-gray-700)',
					800: 'var(--color-gray-800)'
				}
			},
			typography: () => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': 'var(--color-primary)',
						'--tw-prose-headings': 'var(--color-primary)',
						'--tw-prose-lead': 'var(--color-primary)',
						'--tw-prose-links': 'var(--color-accent)',
						'--tw-prose-bold': 'var(--color-primary)',
						'--tw-prose-counters': 'var(--color-secondary)',
						'--tw-prose-bullets': 'var(--color-secondary)',
						'--tw-prose-hr': 'var(--color-border)',
						'--tw-prose-quotes': 'var(--color-primary)',
						'--tw-prose-quote-borders': 'var(--color-border)',
						'--tw-prose-captions': 'var(--color-secondary)',
						'--tw-prose-code': 'var(--color-primary)',
						'--tw-prose-pre-code': 'var(--color-primary)',
						'--tw-prose-pre-bg': 'var(--color-gray-100)',
						'--tw-prose-th-borders': 'var(--color-border)',
						'--tw-prose-td-borders': 'var(--color-border)',
						'--tw-prose-invert-body': 'var(--color-primary)',
						'--tw-prose-invert-headings': 'var(--color-primary)',
						'--tw-prose-invert-lead': 'var(--color-primary)',
						'--tw-prose-invert-links': 'var(--color-accent)',
						'--tw-prose-invert-bold': 'var(--color-primary)',
						'--tw-prose-invert-counters': 'var(--color-secondary)',
						'--tw-prose-invert-bullets': 'var(--color-secondary)',
						'--tw-prose-invert-hr': 'var(--color-border)',
						'--tw-prose-invert-quotes': 'var(--color-primary)',
						'--tw-prose-invert-quote-borders': 'var(--color-border)',
						'--tw-prose-invert-captions': 'var(--color-secondary)',
						'--tw-prose-invert-code': 'var(--color-primary)',
						'--tw-prose-invert-pre-code': 'var(--color-primary)',
						'--tw-prose-invert-pre-bg': 'var(--color-gray-800)',
						'--tw-prose-invert-th-borders': 'var(--color-border)',
						'--tw-prose-invert-td-borders': 'var(--color-border)'
					}
				}
			})
		}
	},
	plugins: [typography]
};
