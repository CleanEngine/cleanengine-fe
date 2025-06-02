/* v8 ignore start */
import ApiClient from '~/shared/api/httpClient';
import type { TokenCheckResponse } from '../types/api';

export default {
	checkToken: () => {
		return ApiClient.get<TokenCheckResponse>('api/tokencheck');
	},
};
/* v8 ignore end */
