/* v8 ignore start */
import { preload } from 'react-dom';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from 'react-router';
import { Slide } from 'react-toastify';
import { ToastContainer } from 'react-toastify/unstyled';

import './app.css';
import ErrorComponent from '~/shared/ui/Error';
import type { Route } from './+types/root';
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
	let errorTitle = '에러발생';
	let errorDescription = '예상하지 못한 에러가 발생했습니다.';
	if (isRouteErrorResponse(error)) {
		errorTitle = `${error.status} ${error.statusText}`;
		errorDescription = error.data;
	}
	if (error instanceof Error) {
		errorTitle = error.name;
		errorDescription = error.message;

		if (import.meta.env.DEV) {
			errorDescription += `\n\n${error.stack}`;
		}
	}

	return <ErrorComponent title={errorTitle} description={errorDescription} />;
}

/* v8 ignore end */
