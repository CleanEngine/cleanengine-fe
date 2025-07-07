import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: true,
	/* Sentry 설정 제외 */
	// buildEnd: async ({ viteConfig, reactRouterConfig, buildManifest }) => {
	// 	await sentryOnBuildEnd({viteConfig, reactRouterConfig, buildManifest});
	// },
} satisfies Config;
