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
		const user = userEvent.setup();
		render(<ChatWindow {...props} state="idle" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();

		await user.type(input, 'test');
		expect(props.handleInputValueChange).toHaveBeenCalledTimes(4);
	});

	it('사용자가 submit 버튼을 클릭하면 handleSubmit이 호출된다.', async () => {
		const user = userEvent.setup();
		render(<ChatWindow {...props} state="idle" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const submitButton = screen.getByRole('button', { name: '↑' });
		expect(submitButton).toBeInTheDocument();

		await user.click(submitButton);
		expect(props.handleSubmit).toHaveBeenCalledTimes(1);
	});

	it('processing 상태에서 input이 disabled된다.', () => {
		render(<ChatWindow {...props} state="processing" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();

		expect(input).toBeDisabled();
	});

	it('complete 상태에서 input이 disabled된다.', () => {
		render(<ChatWindow {...props} state="complete" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();

		expect(input).toBeDisabled();
	});

	it('processing 상태에서 submit 버튼이 disabled된다.', () => {
		render(<ChatWindow {...props} state="processing" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const submitButton = screen.getByRole('button', { name: '↑' });
		expect(submitButton).toBeInTheDocument();

		expect(submitButton).toBeDisabled();
	});

	it('complete 상태에서 submit 버튼이 disabled된다.', () => {
		render(<ChatWindow {...props} state="complete" />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const submitButton = screen.getByRole('button', { name: '↑' });
		expect(submitButton).toBeInTheDocument();

		expect(submitButton).toBeDisabled();
	});

	it('사용자가 close 버튼을 누르면 handleClose 함수가 호출된다.', async () => {
		const user = userEvent.setup();
		render(<ChatWindow {...props} />);

		const chatWindow = screen.getByTestId('chat-window');
		expect(chatWindow).toBeInTheDocument();

		const closeButton = screen.getByRole('button', { name: '×' });
		expect(closeButton).toBeInTheDocument();

		await user.click(closeButton);
		expect(props.handleClose).toBeCalledTimes(1);
	});
});
