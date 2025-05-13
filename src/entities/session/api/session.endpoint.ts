import ApiClient from '~/shared/api/client';

export default {
	logout: () => {
		return ApiClient.get('api/logout');
	},
};
