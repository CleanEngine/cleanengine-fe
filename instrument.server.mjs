import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/react-router';

Sentry.init({
	dsn: 'https://8343c6ee467e6f35f22c570a68cd2e6e@o4509544992407552.ingest.us.sentry.io/4509548888391680',
	sendDefaultPii: true,
	// Enable logs to be sent to Sentry
	_experiments: { enableLogs: true },

	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: 1.0, // Capture 100% of the transactions
	profilesSampleRate: 1.0, // profile every transaction
});
