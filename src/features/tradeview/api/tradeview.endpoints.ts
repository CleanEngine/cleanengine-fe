/* v8 ignore start */
import ApiClient from '~/shared/api/httpClient';
import type { RowData } from '../types/tradeview.type';

export default {
	getPastData: async (ticker = 'TRUMP') => {
		return await ApiClient.get<RowData[]>(`api/minute-ohlc?ticker=${ticker}`);
	},
};
/* v8 ignore end */
