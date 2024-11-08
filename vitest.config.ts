import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**'], // Only include files from the src folder
			exclude: [
				'**/*.d.ts', // Exclude type declaration files
				'src/mocks/**', // Exclude mock files within src if needed
				'src/lib/components', // Exclude specific components directory
				'**/*.svelte' // Exclude all .svelte files
			]
		}
	}
});
