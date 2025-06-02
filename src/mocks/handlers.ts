/* v8 ignore start */
import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/api/tokencheck', async ({ cookies }) => {
		if (!cookies.access_token) {
			return new HttpResponse(null, { status: 401 });
		}
		return new HttpResponse(null, { status: 200 });
	}),
];
/* v8 ignore end */
