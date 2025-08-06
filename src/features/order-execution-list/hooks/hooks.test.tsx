import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StompContext } from '~/app/provider/StompProvider';
import {
	StompTestWrapper,
	mockClient,
} from '~/app/provider/testing/stompTestUtils';
import type { Execution } from '../types/execution.type';
import useExecutionListData from './useExecutionListData';

const TICKER = 'BTC';

const MOCK_EXECUTION_ITEM: Execution = {
	price: 1000,
	size: 1,
	timestamp: new Date().toISOString(),
	changeRate: 3,
	transactionId: '1',
	ticker: 'BTC',
};

function generateDestinationEndPoint(ticker: string) {
	return `/app/subscribe/realTimeTradeRate/${ticker}`;
}

function generateTopicEndPoint(ticker: string) {
	return `/topic/realTimeTradeRate/${ticker}`;
}

describe('useExecutionListData 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('클라이언트가 연결되지 않았을 때는 빈 배열을 리턴한다.', () => {
		const disconnectedWrapper = ({
			children,
		}: { children: React.ReactNode }) => (
			<StompContext.Provider value={{ client: mockClient, connected: false }}>
				{children}
			</StompContext.Provider>
		);

		const { result } = renderHook(() => useExecutionListData(TICKER), {
			wrapper: disconnectedWrapper,
		});

		expect(mockClient.publish).not.toHaveBeenCalled();
		expect(mockClient.subscribe).not.toHaveBeenCalled();

		expect(result.current).toEqual([]);
	});

	it('클라이언트가 연결되고 서버로부터 데이터가 오면 체결내역의 배열을 리턴한다.', async () => {
		(mockClient.subscribe as any).mockImplementation(
			(destination: string, callback: (message: any) => void) => {
				setTimeout(() => {
					callback({ body: JSON.stringify(MOCK_EXECUTION_ITEM) });
				}, 0);
				return { unsubscribe: vi.fn() };
			},
		);

		const { result } = renderHook(() => useExecutionListData(TICKER), {
			wrapper: StompTestWrapper,
		});

		expect(mockClient.publish).toHaveBeenCalledWith({
			destination: generateDestinationEndPoint(TICKER),
			body: JSON.stringify({ ticker: TICKER }),
		});

		expect(mockClient.subscribe).toHaveBeenCalledWith(
			generateTopicEndPoint(TICKER),
			expect.any(Function),
		);

		await waitFor(() => {
			expect(result.current).toEqual([MOCK_EXECUTION_ITEM]);
		});
	});

	it('언마운트가 되면 구독을 해제한다.', () => {
		const mockUnsubscribe = vi.fn();
		mockClient.subscribe.mockReturnValue({
			unsubscribe: mockUnsubscribe,
			id: 'testId',
		});

		const { unmount } = renderHook(() => useExecutionListData(TICKER), {
			wrapper: StompTestWrapper,
		});

		unmount();

		expect(mockUnsubscribe).toHaveBeenCalled();
	});
});
