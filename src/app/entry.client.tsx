import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

async function prepareApp() {
	if (process.env.NODE_ENV === 'development') {
		const { worker } = await import('../mocks/browser');
		return worker.start({ onUnhandledRequest: 'bypass' });
	}

	return Promise.resolve();
}

prepareApp().then(() => {
	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<HydratedRouter />
			</StrictMode>,
		);
	});
});
