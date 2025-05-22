import httpClient from '~/shared/api/httpClient';
import type { CoinListResponse } from '../types/coin.type';

export default {
	getCoinList: () => {
		return httpClient.get<CoinListResponse>('api/asset');
	},
};
