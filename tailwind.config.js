/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundColor: {
				page: 'var(--color-background)',
				surface: 'var(--color-gray-100)',
				'surface-hover': 'var(--color-gray-200)'
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
			}
		}
	},
	plugins: []
};
