import { useMachine } from '@xstate/react';
import { AnimatePresence } from 'motion/react';
import {
	type ChangeEvent,
	type FormEvent,
	Suspense,
	lazy,
	useState,
} from 'react';

import useScrollToBottom from '~/shared/hooks/useScrollToBottom';
import { chatMachine } from '../../model/chat.machine';
import ChatButton from '../ChatButton';
import MessageBox from '../MessageBox';

const LazyChatWindow = lazy(() => import('~/features/chat/ui/ChatWindow'));

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
			<Suspense fallback={null}>
				{isOpen ? (
					<LazyChatWindow
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
					</LazyChatWindow>
				) : (
					<ChatButton handleClick={handleOpenChatWindow} isOpen={isOpen} />
				)}
			</Suspense>
		</AnimatePresence>
	);
}
