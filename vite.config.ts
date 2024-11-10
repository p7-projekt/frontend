import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: path.resolve(__dirname, './src/components')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		exclude: [
			'svelte-codemirror-editor',
			'codemirror',
			'@codemirror/language-javascript'
			// ... other dependencies
		]
	}
});
