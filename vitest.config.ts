import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths()],
	resolve: {
		alias: {
			$src: path.resolve(__dirname, 'src'),
			$lib: path.resolve(__dirname, 'src/lib'), // Add your alias paths here
			$components: path.resolve(__dirname, './src/components'),
			'sveltekit-superforms': path.resolve(
				__dirname,
				'node_modules/sveltekit-superforms/dist/index.js'
			),
			'sveltekit-superforms/adapters': path.resolve(
				__dirname,
				'node_modules/sveltekit-superforms/dist/adapters/index.js'
			)
		}
	},
	test: {
		clearMocks: true,
		coverage: {
			provider: 'v8',
			include: ['src/**'], // Only include files from the src folder
			exclude: [
				'src/lib/debug.ts',
				'src/components/Tests/testcasetypes.ts',
				'src/routes/createexercise/testCasesStore.ts',
				'src/components/FlexTable/index.ts',
				'**/*.d.ts', // Exclude type declaration files
				'src/mocks/**', // Exclude mock files within src if needed
				'src/lib/components', // Exclude specific components directory
				'**/*.svelte' // Exclude all .svelte files
			]
		}
	}
});
