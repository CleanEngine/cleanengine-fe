import * as cookie from 'cookie';

export function extractAccessToken(rawCookie: string | null) {
	if (!rawCookie) return;

	const parsedCookie = cookie.parse(rawCookie);
	return parsedCookie.access_token;
}

export function checkLogin(rawCookie: string | null) {
	const accessToken = extractAccessToken(rawCookie);
	return !!accessToken;
}
