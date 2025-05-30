import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import ChatWindow from '.';

vi.mock('~/shared/hooks/useScrollToBottom', () => ({
	default: vi.fn(),
}));

vi.mock('~/shared/hooks/useDimensions', () => ({
	default: () => ({
		height: 480,
		width: 80,
	}),
}));

const props = {
	children: null,
	state: 'idle' as const,
	inputValue: '',
	messageList: [],
	handleInputValueChange: vi.fn(),
	handleSubmit: vi.fn(),
	handleClose: vi.fn(),
};

describe('ChatWindow 컴포넌트 테스트', () => {
	it('초기 상태에서 ChatWindow가 보여진다.', () => {
		render(<ChatWindow {...props} />);

		const chatWindow = screen.getByTestId('chat-window');

		expect(chatWindow).toBeInTheDocument();
	});

	it('사용자는 idle 상태에서 메시지를 입력할 수 있다.', async () => {
		// TODO: 테스트 작업중
		const user = userEvent.setup();
		render(<ChatWindow {...props} state="idle" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();

		await user.type(input, 'test');
		expect(input).toHaveValue('test');
	});
});
