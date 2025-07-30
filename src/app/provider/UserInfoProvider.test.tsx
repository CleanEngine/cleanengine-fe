import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserIdProvider, { useUserId } from './UserInfoProvider';

const mockStore = new Map();

vi.mock('window', () => {
	return {
		localStorage: {
			getItem: vi.fn((key) => mockStore.get(key)),
			setItem: vi.fn((key, value) => mockStore.set(key, value)),
			removeItem: vi.fn((key) => mockStore.delete(key)),
			clear: vi.fn(() => mockStore.clear()),
		},
	};
});

const MOCK_USERID = 4;

describe('UserInfoProvider 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.localStorage.clear();
	});

	it('useUserId hook은 UserInfoProvider 외부에서 사용하면 에러를 던진다.', () => {
		expect(() => renderHook(() => useUserId())).toThrowError();
	});

	it('초기 상태에서는 userId가 null이다.', () => {
		const { result } = renderHook(useUserId, {
			wrapper: ({ children }) => <UserIdProvider>{children}</UserIdProvider>,
		});

		expect(result.current.userId).toBe(null);
	});

	it('초기 마운트 시 로컬스토리지에서 userId를 불러온다.', () => {
		window.localStorage.setItem('userId', MOCK_USERID.toString());

		const { result } = renderHook(useUserId, {
			wrapper: ({ children }) => <UserIdProvider>{children}</UserIdProvider>,
		});

		expect(result.current.userId).toBe(MOCK_USERID);
	});

	it('setUserId를 호출하면 userId 상태가 업데이트된다.', () => {
		const { result } = renderHook(useUserId, {
			wrapper: ({ children }) => <UserIdProvider>{children}</UserIdProvider>,
		});

		expect(result.current.userId).toBe(null);

		act(() => {
			result.current.setUserId(MOCK_USERID);
		});

		expect(result.current.userId).toBe(MOCK_USERID);
	});
});
