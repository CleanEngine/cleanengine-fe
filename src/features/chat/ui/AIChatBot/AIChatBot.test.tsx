import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import AIChatBot from '.';
import type { MessageObj } from '../../types/chat.type';

const USER_TEXT = 'test';
const AI_ANSWER = 'ai answer';

vi.mock('~/shared/hooks/useScrollIntoView', () => ({
	default: () => ({ current: { scrollIntoView: vi.fn() } }),
}));

vi.mock('@xstate/react', () => {
	return {
		useMachine: vi.fn().mockImplementation(() => {
			const [state, setState] = React.useState({
				context: {
					state: 'idle' as 'idle' | 'processing',
					question: '',
					messageList: [] as MessageObj[],
				},
			});

			const send = vi.fn().mockImplementation((event) => {
				if (event.type === 'TYPING_QUESTION') {
					setState((prev) => ({
						...prev,
						context: {
							...prev.context,
							question: event.question,
						},
					}));
				} else if (event.type === 'SUBMIT_EVENT') {
					setState((prev) => {
						const newMessageList = [
							...prev.context.messageList,
							{
								isMine: true,
								message: prev.context.question,
							},
						];
						return {
							...prev,
							context: {
								...prev.context,
								state: 'processing',
								question: '',
								messageList: newMessageList,
							},
						};
					});

					setTimeout(() => {
						setState((prev) => ({
							...prev,
							context: {
								...prev.context,
								state: 'idle',
								messageList: [
									...prev.context.messageList,
									{
										isMine: false,
										message: AI_ANSWER,
									},
								],
							},
						}));
					}, 1000);
				}
			});

			return [state, send];
		}),
	};
});

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

		const chatWindow = await screen.findByTestId('chat-window');

		expect(chatWindow).toBeInTheDocument();
	});

	it('사용자가 ChatButton을 클릭하면 ChatWindow가 보여졌다고 닫기 버튼을 누르면 ChatWindow가 사라지고 ChatButton이 보여진다.', async () => {
		const user = userEvent.setup();
		render(<AIChatBot />);

		const chatButton = screen.getByTestId('chat-button');
		expect(chatButton).toBeInTheDocument();
		await user.click(chatButton);

		const chatWindow = await screen.findByTestId('chat-window');
		const closeButton = await screen.findByTestId('chat-window-close-button');

		expect(chatWindow).toBeInTheDocument();

		await user.click(closeButton);

		await waitFor(() => {
			expect(screen.queryByTestId('chat-window')).not.toBeInTheDocument();
		});

		const newChatButton = screen.getByTestId('chat-button');
		expect(newChatButton).toBeInTheDocument();
	});

	it('사용자가 텍스트를 입력하면 input필드에 입력된 텍스트가 보이고 submit 버튼을 누르면 ChatWindow에 메시지가 추가된다.', async () => {
		const user = userEvent.setup();
		render(<AIChatBot />);

		const chatButton = screen.getByTestId('chat-button');
		expect(chatButton).toBeInTheDocument();
		await user.click(chatButton);

		const input = await screen.findByRole('textbox');
		expect(input).toBeInTheDocument();

		await user.type(input, USER_TEXT);
		expect(input).toHaveValue(USER_TEXT);

		await user.click(screen.getByRole('button', { name: '↑' }));
	});

	it('사용자가 텍스트를 입력하면 input필드에 입력된 텍스트가 보이고 submit 버튼을 누르면 ChatWindow에 메시지가 추가되고 AI가 답변을하면 ChatWindow에 메시지가 추가된다.', async () => {
		const user = userEvent.setup();
		render(<AIChatBot />);

		const chatButton = screen.getByTestId('chat-button');
		expect(chatButton).toBeInTheDocument();
		await user.click(chatButton);

		const input = await screen.findByRole('textbox');
		expect(input).toBeInTheDocument();

		await user.type(input, USER_TEXT);
		expect(input).toHaveValue(USER_TEXT);

		await user.click(screen.getByRole('button', { name: '↑' }));

		await waitFor(
			() => {
				expect(screen.getByText(AI_ANSWER)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	});
});
