import { reactRouter } from '@react-router/dev/vite';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { type PluginOption, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/* Sentry 설정 제외 */
export default defineConfig((config) => {
	// const env = loadEnv(config.mode, process.cwd());
	// const sentryConfig: SentryReactRouterBuildOptions = {
	// 	org: env.VITE_SENTRY_ORG,
	// 	project: env.VITE_SENTRY_PROJECT,
	// 	authToken: env.VITE_SENTRY_AUTH_TOKEN,
	// };

	return {
		plugins: [
			svgr(),
			tailwindcss(),
			reactRouter(),
			tsconfigPaths(),
			visualizer() as PluginOption,
			// sentryReactRouter(sentryConfig, config),
		],
		optimizeDeps: {
			exclude: ['@amcharts/amcharts5'],
		},
		build: {
			rollupOptions: {
				external: ['d3-geo,d3-selection,d3-transition'],
			},
		},
	};
});
