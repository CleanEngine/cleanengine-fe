import ApiClient from '~/shared/api/client';
import type { TokenCheckResponse } from '../types/api';

export default {
	checkToken: () => {
		return ApiClient.get<TokenCheckResponse>('api/tokencheck');
	},
};
