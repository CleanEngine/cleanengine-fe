/* v8 ignore start */
import ApiClient from '~/shared/api/httpClient';

export default {
	logout: () => {
		return ApiClient.get('api/logout');
	},
};
/* v8 ignore end */
