import ApiClient from '~/shared/api/httpClient';
import type { UserInfoResponse } from '../types/user.type';

export default {
	getUserInfo: () => {
		return ApiClient.get<UserInfoResponse>('api/userinfo');
	},
};
