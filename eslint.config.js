import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		plugins: {
			'simple-import-sort': simpleImportSort
		},
		rules: {
			// Import sorting with custom groups
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Side effect imports first
						['^\\u0000'],
						// Node.js builtins
						['^node:'],
						// External packages
						['^@?\\w'],
						// Svelte related packages
						['^svelte', '^@svelte'],
						// Aliased imports (starting with $)
						['^\\$'],
						// Internal packages/components
						['^@/'],
						// Parent imports (starting with ../)
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						// Sibling imports (starting with ./)
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						// Style imports
						['^.+\\.s?css$']
					]
				}
			],
			'simple-import-sort/exports': 'error',

			// Additional rules for better code quality
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-unused-vars': 'off', // TypeScript handles this
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn'
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			// Svelte-specific rules
			'svelte/no-at-html-tags': 'warn',
			'svelte/valid-compile': 'error',
			'svelte/no-unused-svelte-ignore': 'error',
			'svelte/html-quotes': ['error', { prefer: 'single' }],
			'svelte/html-self-closing': 'error',
			'svelte/shorthand-attribute': 'error',
			'svelte/spaced-html-comment': 'error',
			'svelte/no-useless-mustaches': 'error'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
);
