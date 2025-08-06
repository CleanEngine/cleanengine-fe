import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { StompContext } from '~/app/provider/StompProvider';

export const mockClient = {
	publish: vi.fn(),
	subscribe: vi.fn(() => ({
		unsubscribe: vi.fn(),
		id: 'testId',
	})),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
} as any;

export const mockStompContextValue = {
	client: mockClient,
	connected: true,
};

export const StompTestWrapper = ({ children }: { children: ReactNode }) => (
	<StompContext.Provider value={mockStompContextValue}>
		{children}
	</StompContext.Provider>
);
