/* v8 ignore start */
import ApiClient from '~/shared/api/httpClient';
import type { RawData } from '../types/tradeview.type';

export default {
	getPastData: async (
		ticker = 'TRUMP',
		interval = 1,
		count = 100,
		from?: string,
	) => {
		return await ApiClient.get<RawData[]>(
			`api/minute-ohlc?ticker=${ticker}&count=${count}&interval=${interval}${from ? `&from=${from}` : ''}`,
		);
	},
};
/* v8 ignore end */
