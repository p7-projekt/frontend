import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
    plugins: [sveltekit(), commonjs()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    optimizeDeps: {
        exclude: ['svelte-codemirror-editor', 'codemirror', '@codemirror/language-javascript' /* ... */]
    }
});