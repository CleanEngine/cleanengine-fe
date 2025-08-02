/* v8 ignore start */
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

/* Sentry 설정 제외 */
// Sentry.init({
// 	dsn: 'https://8343c6ee467e6f35f22c570a68cd2e6e@o4509544992407552.ingest.us.sentry.io/4509548888391680',

// 	sendDefaultPii: true,

// 	integrations: [
// 		Sentry.reactRouterTracingIntegration(),
// 		Sentry.replayIntegration(),
// 		Sentry.feedbackIntegration({
// 			colorScheme: 'system',
// 		}),
// 	],

// 	_experiments: { enableLogs: true },

// 	tracesSampleRate: 1.0,

// 	// Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
// 	tracePropagationTargets: [/^\//, /^https:\/\/investfuture\.my\/api/],
// 	// Capture Replay for 10% of all sessions,
// 	// plus 100% of sessions with an error
// 	replaysSessionSampleRate: 0.1,
// 	replaysOnErrorSampleRate: 1.0,
// });

async function prepareApp() {
	if (process.env.NODE_ENV !== 'development') {
		return;
	}

	const { worker } = await import('../mocks/browser');

	return worker.start();
}

prepareApp().then(() => {
	startTransition(() => {
		hydrateRoot(document, <HydratedRouter />);
	});
});

/* v8 ignore end */
