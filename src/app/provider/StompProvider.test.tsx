import { Client } from '@stomp/stompjs';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StompProvider, { useStompClient } from './StompProvider';

const brokerURL = 'ws://localhost:8080';

vi.mock('@stomp/stompjs', () => ({
	Client: vi.fn(function (this: any, config: any) {
		this.brokerURL = config.brokerURL;
		this.activate = vi.fn();
		this.deactivate = vi.fn();
		this.onConnect = null;
		this.onDisconnect = null;
		this.onWebSocketError = null;
		this.onStompError = null;
	}),
}));

describe('useStompClient 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('useStompClient hook은 StompProvider 외부에서 사용하면 에러를 던진다.', () => {
		expect(() => renderHook(() => useStompClient())).toThrowError();
	});

	it('초기 상태에서는 connected가 false이다.', () => {
		const { result } = renderHook(() => useStompClient(), {
			wrapper: ({ children }) => (
				<StompProvider brokerURL={brokerURL}>{children}</StompProvider>
			),
		});

		expect(result.current).toHaveProperty('client');
		expect(result.current.client).toBeTruthy();
		expect(result.current).toHaveProperty('connected');
		expect(result.current.connected).toBe(false);
	});

	it('onConnect 콜백이 호출되면 connected가 true가 된다.', () => {
		const { result } = renderHook(() => useStompClient(), {
			wrapper: ({ children }) => (
				<StompProvider brokerURL={brokerURL}>{children}</StompProvider>
			),
		});

		expect(result.current.connected).toBe(false);

		act(() => {
			const clientInstance = vi.mocked(Client).mock.instances[0] as any;
			clientInstance?.onConnect?.();
		});

		expect(result.current.connected).toBe(true);
	});

	it('onDisconnect 콜백이 호출되면 connected가 false가 된다.', () => {
		const { result } = renderHook(() => useStompClient(), {
			wrapper: ({ children }) => (
				<StompProvider brokerURL={brokerURL}>{children}</StompProvider>
			),
		});

		const clientInstance = vi.mocked(Client).mock.instances[0] as any;
		act(() => {
			clientInstance?.onConnect?.();
		});
		expect(result.current.connected).toBe(true);

		act(() => {
			clientInstance?.onDisconnect?.();
		});

		expect(result.current.connected).toBe(false);
	});

	it('onWebSocketError 콜백이 호출되면 connected가 false가 된다.', () => {
		const { result } = renderHook(() => useStompClient(), {
			wrapper: ({ children }) => (
				<StompProvider brokerURL={brokerURL}>{children}</StompProvider>
			),
		});

		const clientInstance = vi.mocked(Client).mock.instances[0] as any;
		act(() => {
			clientInstance?.onConnect?.();
		});
		expect(result.current.connected).toBe(true);

		act(() => {
			const mockError = new Error('WebSocket connection failed');
			clientInstance?.onWebSocketError?.(mockError);
		});

		expect(result.current.connected).toBe(false);
	});
});
