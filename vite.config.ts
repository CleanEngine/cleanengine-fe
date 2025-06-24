import { reactRouter } from '@react-router/dev/vite';
import {
	type SentryReactRouterBuildOptions,
	sentryReactRouter,
} from '@sentry/react-router';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { type PluginOption, defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig((config) => {
	const env = loadEnv(config.mode, process.cwd());
	const sentryConfig: SentryReactRouterBuildOptions = {
		org: env.VITE_SENTRY_ORG,
		project: env.VITE_SENTRY_PROJECT,
		authToken: env.VITE_SENTRY_AUTH_TOKEN,
	};

	return {
		plugins: [
			svgr(),
			tailwindcss(),
			reactRouter(),
			tsconfigPaths(),
			visualizer() as PluginOption,
			sentryReactRouter(sentryConfig, config),
		],
		optimizeDeps: {
			exclude: ['@amcharts/amcharts5'],
		},
		ssr: {
			noExternal: ['@amcharts/amcharts5'],
		},
		build: {
			rollupOptions: {
				external: ['d3-geo,d3-selection,d3-transition'],
			},
		},
	};
});
