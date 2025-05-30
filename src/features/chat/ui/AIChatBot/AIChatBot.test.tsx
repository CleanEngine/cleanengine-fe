import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import AIChatBot from '.';

vi.mock('~/shared/hooks/useScrollToBottom', () => ({
	default: () => ({ current: { scrollIntoView: vi.fn() } }),
}));

describe('AIChatBot 컴포넌트 테스트', () => {
	it('초기 상태에서 ChatButton이 보여진다.', () => {
		render(<AIChatBot />);

		const chatButton = screen.getByTestId('chat-button');

		expect(chatButton).toBeInTheDocument();
	});

	it('사용자가 ChatButton을 클릭하면 ChatWindow가 보여진다.', async () => {
		const user = userEvent.setup();
		render(<AIChatBot />);

		const chatButton = screen.getByTestId('chat-button');

		expect(chatButton).toBeInTheDocument();

		await user.click(chatButton);

		const chatWindow = screen.getByTestId('chat-window');

		expect(chatWindow).toBeInTheDocument();
	});

	it('사용자가 ChatButton을 클릭하면 ChatWindow가 보여졌다고 닫기 버튼을 누르면 ChatWindow가 사라지고 ChatButton이 보여진다.', async () => {
		const user = userEvent.setup();
		render(<AIChatBot />);

		const chatButton = screen.getByTestId('chat-button');

		expect(chatButton).toBeInTheDocument();

		await user.click(chatButton);

		const chatWindow = screen.getByTestId('chat-window');
		const closeButton = screen.getByTestId('chat-window-close-button');

		expect(chatWindow).toBeInTheDocument();

		await user.click(closeButton);

		expect(chatWindow).not.toBeInTheDocument();
	});
});
