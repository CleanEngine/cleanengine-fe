import svgr from '@svgr/rollup';
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [svgr(), tsconfigPaths()],
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
