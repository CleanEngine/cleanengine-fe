import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StompContext } from '~/app/provider/StompProvider';
import {
	StompTestWrapper,
	mockClient,
} from '~/app/provider/testing/stompTestUtils';
import useCurrentPrice, { type CurrentPriceData } from './useCurrentPrice';

const TICKER_FIRST = 'BTC';
const TICKER_SECOND = 'ETH';

function generateDestinationEndPoint(ticker: string) {
	return `/app/subscribe/prevRate/${ticker}`;
}

function generateTopicEndPoint(ticker: string) {
	return `/topic/prevRate/${ticker}`;
}

describe('useCurrentPrice 훅 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('클라이언트가 연결되지 않았을 때는 아무것도 하지 않는다', () => {
		const disconnectedWrapper = ({ children }: { children: ReactNode }) => (
			<StompContext.Provider value={{ client: mockClient, connected: false }}>
				{children}
			</StompContext.Provider>
		);

		renderHook(() => useCurrentPrice(TICKER_FIRST), {
			wrapper: disconnectedWrapper,
		});

		expect(mockClient.publish).not.toHaveBeenCalled();
		expect(mockClient.subscribe).not.toHaveBeenCalled();
	});

	it('클라이언트가 연결되면 올바른 destination으로 publish한다', () => {
		renderHook(() => useCurrentPrice(TICKER_FIRST), {
			wrapper: StompTestWrapper,
		});

		expect(mockClient.publish).toHaveBeenCalledWith({
			destination: generateDestinationEndPoint(TICKER_FIRST),
			body: JSON.stringify({ ticker: TICKER_FIRST }),
		});
	});

	it('올바른 topic으로 subscribe한다', () => {
		renderHook(() => useCurrentPrice(TICKER_FIRST), {
			wrapper: StompTestWrapper,
		});

		expect(mockClient.subscribe).toHaveBeenCalledWith(
			generateTopicEndPoint(TICKER_FIRST),
			expect.any(Function),
		);
	});

	it('메시지를 받으면 데이터를 파싱하여 상태를 업데이트한다', async () => {
		const mockData: CurrentPriceData = {
			changeRate: 0.05,
			currentPrice: 50000,
			prevClose: 47500,
			ticker: 'BTC',
			timestamp: '2024-01-01T00:00:00Z',
		};

		const mockMessage = {
			body: JSON.stringify(mockData),
		};

		mockClient.subscribe.mockImplementation(
			(destination: string, callback: (message: any) => void) => {
				setTimeout(() => callback(mockMessage), 0);
				return { unsubscribe: vi.fn() };
			},
		);

		const { result } = renderHook(() => useCurrentPrice(TICKER_FIRST), {
			wrapper: StompTestWrapper,
		});

		await waitFor(() => {
			expect(result.current).toEqual(mockData);
		});
	});

	it('ticker가 변경되면 새로운 구독을 생성한다', () => {
		const { rerender } = renderHook(({ ticker }) => useCurrentPrice(ticker), {
			wrapper: StompTestWrapper,
			initialProps: { ticker: TICKER_FIRST },
		});

		rerender({ ticker: TICKER_SECOND });

		expect(mockClient.publish).toHaveBeenCalledWith({
			destination: generateDestinationEndPoint(TICKER_SECOND),
			body: JSON.stringify({ ticker: TICKER_SECOND }),
		});
	});

	it('컴포넌트가 언마운트되면 구독을 해제한다', () => {
		const mockUnsubscribe = vi.fn();
		mockClient.subscribe.mockReturnValue({
			unsubscribe: mockUnsubscribe,
			id: 'testId',
		});

		const { unmount } = renderHook(() => useCurrentPrice(TICKER_FIRST), {
			wrapper: StompTestWrapper,
		});

		unmount();

		expect(mockUnsubscribe).toHaveBeenCalled();
	});
});
