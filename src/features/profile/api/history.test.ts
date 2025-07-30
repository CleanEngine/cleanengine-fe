import { describe } from 'node:test';
import { expect, it, vi } from 'vitest';
import ApiClient from '~/shared/api/httpClient';
import historyApi from './history.endpoint';

vi.mock('~/shared/api/httpClient', () => ({
	default: {
		get: vi.fn(),
		delete: vi.fn(),
	},
}));

const getHistoryParams = {
	page: 1,
	size: 10,
	settled: true,
};

const deleteHistoryParams = {
	orderId: 'testOrderId',
};

describe('history api 테스트', () => {
	it('getHistory가 호출되면 api 클라이언트가 호출된다', () => {
		historyApi.getHistory(
			getHistoryParams.page,
			getHistoryParams.size,
			getHistoryParams.settled,
		);

		const urlParams = new URLSearchParams();
		urlParams.set('page', getHistoryParams.page.toString());
		urlParams.set('size', getHistoryParams.size.toString());

		if (getHistoryParams.settled) urlParams.set('settled', 'true');
		else urlParams.set('settled', 'false');

		expect(ApiClient.get).toHaveBeenCalledWith(
			`api/userinfo/trades?${urlParams.toString()}`,
			undefined,
		);
	});
	it('deleteHistory가 호출되면 api 클라이언트가 호출된다.', () => {
		historyApi.deleteHistory(deleteHistoryParams.orderId);

		expect(ApiClient.delete).toHaveBeenCalledWith(
			`api/userinfo/trades?orderId=${deleteHistoryParams.orderId}`,
			undefined,
		);
	});
});
