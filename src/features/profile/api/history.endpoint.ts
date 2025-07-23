import ApiClient from '~/shared/api/httpClient';
import type { HistoryResponse } from '../types/tradingHistory.type';

export default {
	getHistory: (page?: number, size?: number, settled?: boolean) => {
		const params = new URLSearchParams();

		if (page) params.set('page', page.toString());
		if (size) params.set('size', size.toString());

		if (settled) params.set('settled', 'true');
		else params.set('settled', 'false');

		return ApiClient.get<HistoryResponse>(
			`api/userinfo/trades?${params.toString()}`,
		);
	},
};
