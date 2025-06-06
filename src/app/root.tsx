import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from 'react-router';
import { ToastContainer } from 'react-toastify/unstyled';
import 'react-toastify/ReactToastify.css';
import type { Route } from './+types/root';

import './app.css';
import { Slide } from 'react-toastify';
import StompProvider from './provider/StompProvider';

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
	{
		rel: 'manifest',
		href: '/site.webmanifest',
	},
	{
		rel: 'apple-touch-icon',
		href: '/apple-touch-icon.png',
		sizes: '180x180',
	},
	{
		rel: 'icon',
		href: '/favicon-16x16.png',
		type: 'image/png',
		sizes: '16x16',
	},
	{
		rel: 'icon',
		href: '/favicon-32x32.png',
		type: 'image/png',
		sizes: '32x32',
	},
];

export function meta() {
	return [
		{
			title: 'Invest Future',
		},
	];
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-dvh font-display">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<StompProvider brokerURL={`${import.meta.env.VITE_STOMP_URL}/api/coin/min`}>
			<Outlet />
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Slide}
				stacked
			/>
		</StompProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
