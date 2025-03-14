export const lightTheme = {
	colors: {
		primary: '#1a1a1a', // Main text color
		secondary: '#6B7280', // Secondary text color (gray-500)
		tertiary: '#4B5563', // Darker secondary (gray-600)
		accent: '#3B82F6', // Accent color (blue-500)
		background: '#FFFFFF', // Background color
		border: '#E5E7EB', // Border color (gray-300)
		hover: '#2563EB', // Hover state color (blue-600)
		hoverSubtle: '#E5E7EB', // Subtle hover state (gray-200)

		// Gray scale
		gray: {
			100: '#F3F4F6',
			200: '#E5E7EB',
			300: '#D1D5DB',
			500: '#6B7280',
			600: '#4B5563',
			700: '#374151',
			800: '#1F2937'
		}
	},
	fonts: {
		primary: 'InterDisplay',
		weights: {
			light: '100',
			medium: '500',
			heavy: '750'
		}
	},
	spacing: {
		nav: {
			desktop: '8', // 2rem (32px)
			mobile: '2' // 0.5rem (8px)
		},
		content: {
			desktop: '8', // 2rem (32px)
			mobile: '0' // 0
		}
	},
	transitions: {
		default: 'all 0.2s ease-in-out'
	}
};

export const darkTheme = {
	...lightTheme,
	colors: {
		primary: '#FFFFFF', // Main text color
		secondary: '#9CA3AF', // Secondary text color
		tertiary: '#D1D5DB', // Lighter secondary for dark mode
		accent: '#60A5FA', // Lighter blue for dark mode
		background: '#1F2937', // Dark background
		border: '#374151', // Darker border for dark mode
		hover: '#3B82F6', // Hover state color
		hoverSubtle: '#4B5563', // Subtle hover state (gray-300)

		// Gray scale (inverted for dark mode)
		gray: {
			100: '#1F2937',
			200: '#374151',
			300: '#4B5563',
			500: '#9CA3AF',
			600: '#D1D5DB',
			700: '#E5E7EB',
			800: '#F3F4F6'
		}
	}
};

export const themeConfig = lightTheme;
export type ThemeConfig = typeof lightTheme;
