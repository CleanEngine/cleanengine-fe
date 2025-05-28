/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./setupTests.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['html', 'json', 'text'],
			include: ['src/**/*'],
			exclude: ['**/*.test.{ts,tsx}', '**/__tests__/**', '**/types/**'],
		},
	},
});
