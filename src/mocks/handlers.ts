/* v8 ignore start */
import { http, HttpResponse } from 'msw';
import type { Response } from '~/shared/types/api';
import { DUMMY_USERINFO_DATA } from './dummy';

function api(endpoint: string) {
	return `http://localhost:8080/api/${endpoint}`;
}

function successResponse<T>(data: T) {
	const response: Response<T> = {
		data: data,
		isSuccess: true,
		error: null,
	};

	return response;
}

export const handlers = [
	http.get(api('tokencheck'), async ({ cookies }) => {
		if (!cookies.access_token) {
			return new HttpResponse(null, { status: 401 });
		}
		return new HttpResponse(null, { status: 200 });
	}),
	http.get(api('userinfo'), async () => {
		return HttpResponse.json(successResponse(DUMMY_USERINFO_DATA), {
			status: 200,
		});
	}),
];
/* v8 ignore end */
