import { createCookieSessionStorage } from 'react-router';

type SessionData = {
	userId: string;
	referer: string;
};

type SessionFlashData = {
	error: string;
};

const MINITE = 60;

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: '__session',

			httpOnly: true,
			maxAge: MINITE * 60 * 24,
			path: '/',
			sameSite: 'lax',
			secrets: [String(import.meta.env.VITE_APP_SECRET)],
			secure: true,
		},
	});

export { getSession, commitSession, destroySession };
