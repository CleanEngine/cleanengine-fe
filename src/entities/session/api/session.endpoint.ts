import ApiClient from '~/shared/api/httpClient';

export default {
	logout: () => {
		return ApiClient.get('api/logout');
	},
};
