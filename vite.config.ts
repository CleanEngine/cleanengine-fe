import { reactRouter } from '@react-router/dev/vite';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [svgr(), tailwindcss(), reactRouter(), tsconfigPaths()],
	optimizeDeps: {
		exclude: ['@amcharts/amcharts5'],
	},
	ssr: {
		noExternal: ['@amcharts/amcharts5'],
	},
});
