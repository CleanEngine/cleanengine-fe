import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from 'react-router';
import { ToastContainer } from 'react-toastify/unstyled';
import type { Route } from './+types/root';

import './app.css';
import { preload } from 'react-dom';
import { Slide } from 'react-toastify';
import StompProvider from './provider/StompProvider';
import UserIdProvider from './provider/UserInfoProvider';

export const links: Route.LinksFunction = () => [
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
	{
		rel: 'stylesheet',
		href: '/ReactToastify.css',
		media: 'print',
		onload: 'this.media="all"',
	},
];

export function meta() {
	return [
		{
			title: 'Invest Future',
		},
	];
}

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	preload('/fonts/Pretendard-Medium.woff2', {
		as: 'font',
		crossOrigin: 'anonymous',
	});
	preload('/fonts/Pretendard-Regular.woff2', {
		as: 'font',
		crossOrigin: 'anonymous',
	});
	preload('/fonts/Pretendard-SemiBold.woff2', {
		as: 'font',
		crossOrigin: 'anonymous',
	});

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
		<UserIdProvider>
			<StompProvider
				brokerURL={`${import.meta.env.VITE_STOMP_URL}/api/coin/min`}
			>
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
		</UserIdProvider>
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
