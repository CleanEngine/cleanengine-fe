import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/api/tokencheck', async ({ cookies }) => {
		if (!cookies.accessToken) {
			return new HttpResponse(null, { status: 401 });
		}
		return new HttpResponse(null, { status: 200 });
	}),
];
