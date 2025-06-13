/* v8 ignore start */
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

async function prepareApp() {
	return Promise.resolve();
}

prepareApp().then(() => {
	startTransition(() => {
		hydrateRoot(
			document,
			// <StrictMode>
			// </StrictMode>,
			<HydratedRouter />,
		);
	});
});

/* v8 ignore end */
