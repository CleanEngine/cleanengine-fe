import { useMachine } from '@xstate/react';
import { AnimatePresence } from 'motion/react';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import useScrollToBottom from '~/shared/hooks/useScrollToBottom';
import { chatMachine } from '../../model/chat.machine';
import ChatButton from '../ChatButton';
import ChatWindow from '../ChatWindow';
import MessageBox from '../MessageBox';

export default function AIChatBot() {
	const [state, send] = useMachine(chatMachine);
	const [isOpen, setIsOpen] = useState(false);
	const messagesEndRef = useScrollToBottom([state.context.messageList]);

	const handleOpenChatWindow = () => {
		setIsOpen(true);
	};

	const handleCloseChatWindow = () => {
		setIsOpen(false);
	};

	const handleQuestionFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
		send({ type: 'TYPING_QUESTION', question: e.target.value });
	};

	const handleSubmitQuestion = (e: FormEvent) => {
		e.preventDefault();
		send({ type: 'SUBMIT_EVENT' });
	};

	return (
		<AnimatePresence mode="wait" propagate>
			{isOpen ? (
				<ChatWindow
					handleClose={handleCloseChatWindow}
					inputValue={state.context.question}
					handleSubmit={handleSubmitQuestion}
					handleInputValueChange={handleQuestionFieldChange}
					state={state.context.state}
					key="chat-window"
				>
					{state.context.messageList.map((message, index) => {
						const key = `msg-${index}-${message.isMine ? 'user' : 'ai'}`;
						return (
							<MessageBox
								key={key}
								direction={message.isMine ? 'right' : 'left'}
								message={message.message}
							/>
						);
					})}
					<div ref={messagesEndRef} />
				</ChatWindow>
			) : (
				<ChatButton handleClick={handleOpenChatWindow} isOpen={isOpen} />
			)}
		</AnimatePresence>
	);
}
