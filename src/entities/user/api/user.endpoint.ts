/* v8 ignore start */
import ApiClient from '~/shared/api/httpClient';
import type { UserInfoResponse } from '../types/user.type';

export default {
	getUserInfo: (init?: RequestInit) => {
		return ApiClient.get<UserInfoResponse>('api/userinfo', init);
	},
};
/* v8 ignore end */
