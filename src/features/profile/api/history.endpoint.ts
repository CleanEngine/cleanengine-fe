import ApiClient from '~/shared/api/httpClient';
import type { HistoryResponse } from '../types/tradingHistory.type';

export default {
	getHistory: (
		page?: number,
		size?: number,
		type?: 'unsettled' | 'settled',
	) => {
		const params = new URLSearchParams();

		if (page) params.set('page', page.toString());
		if (size) params.set('size', size.toString());
		if (type) params.set('type', type);

		return ApiClient.get<HistoryResponse>(`api/history?${params.toString()}`);
	},
};
