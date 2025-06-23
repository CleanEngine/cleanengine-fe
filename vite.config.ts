import { reactRouter } from '@react-router/dev/vite';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { type PluginOption, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		svgr(),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		visualizer() as PluginOption,
	],
	optimizeDeps: {
		exclude: ['@amcharts/amcharts5'],
	},
	build: {
		rollupOptions: {
			external: ['d3-geo,d3-selection,d3-transition'],
		},
	},
});
