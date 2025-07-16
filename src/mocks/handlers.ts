/* v8 ignore start */
import { http, HttpResponse } from 'msw';
import type { HistoryResonseData } from '~/features/profile/types/tradingHistory.type';
import type { Response } from '~/shared/types/api';
import { DUMMY_HISTORY_LIST, DUMMY_USERINFO_DATA } from './dummy';

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
	http.get(api('history'), async ({ request }) => {
		const { searchParams } = new URL(request.url);

		const page = Number(searchParams.get('page') || 1);
		const size = Number(searchParams.get('size') || 10);
		const settled =
			searchParams.get('settled') === 'true' ? 'settled' : 'unsettled';

		const filteredOrderlist = DUMMY_HISTORY_LIST.filter(
			(item) => item.status === settled,
		);
		const firstItemIndex = (page - 1) * size;
		const lastItemIndex = page * size;

		const historyData: HistoryResonseData = {
			orderList: filteredOrderlist.slice(firstItemIndex, lastItemIndex + 1),
			totalPages: Math.ceil(filteredOrderlist.length / size),
			currentPage: page,
			pageSize: size,
		};

		return HttpResponse.json(successResponse(historyData), {
			status: 200,
		});
	}),
];
/* v8 ignore end */
