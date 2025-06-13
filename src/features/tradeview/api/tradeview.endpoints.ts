/* v8 ignore start */
import ApiClient from '~/shared/api/httpClient';
import type { RowData } from '../types/tradeview.type';

export default {
	getPastData: async (ticker = 'TRUMP', period = 1) => {
		return await ApiClient.get<RowData[]>(
			`api/minute-ohlc?ticker=${ticker}&period=${period}`,
		);
	},
};
/* v8 ignore end */
