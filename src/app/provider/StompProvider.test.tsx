import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import StompProvider, { useStompClient } from './StompProvider';

vi.mock('@stomp/stompjs', () => {
	return {
		Client: vi.fn().mockImplementation(() => {
			return {
				activate: vi.fn(),
				deactivate: vi.fn(),
				onConnect: null,
				onDisconnect: null,
				onWebSocketError: null,
				onStompError: null,
			};
		}),
	};
});

describe('useStompClient 테스트', () => {
	it('useStompClient hook은 StompProvider 외부에서 사용하면 에러를 던진다.', () => {
		expect(() => renderHook(() => useStompClient())).toThrowError();
	});

	it('useStompClient hook은 StompProvider 내부에서 사용하면 정상 작동한다.', () => {
		const { result } = renderHook(() => useStompClient(), {
			wrapper: ({ children }) => (
				<StompProvider brokerURL="">{children}</StompProvider>
			),
		});

		expect(result.current).toHaveProperty('client');
		expect(result.current).toHaveProperty('connected');
	});
});
