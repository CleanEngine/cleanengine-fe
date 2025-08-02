/* v8 ignore start */
import { type RouteConfig, prefix, route } from '@react-router/dev/routes';

export default [
	route('', './routes/_index.tsx', [route('trade', './routes/catchTrade.tsx')]),
	route('callback', './routes/callback.tsx'),
	...prefix('trade', [
		route(':ticker', './routes/trade.tsx', [
			route('login', './routes/login.tsx'),
			route('profile', './routes/profile.tsx', [
				route('history', './routes/history.tsx'),
			]),
		]),
	]),
] satisfies RouteConfig;
/* v8 ignore end */
