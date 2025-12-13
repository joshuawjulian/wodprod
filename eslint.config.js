import js from '@eslint/js';
import prettier, { rules } from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier, // Must be last to override other configs
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'no-unused-vars': 'off', // Disable standard rule
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
			]
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
];
