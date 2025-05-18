import httpClient from '~/shared/api/httpClient';
import type { OrderRequestData, OrderResponse } from '../types/order.endpoint';

export default {
	order: async (data: OrderRequestData) => {
		return await httpClient.post<OrderResponse>('api/orders', data);
	},
};
