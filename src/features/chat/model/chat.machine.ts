import { assertEvent, assign, fromPromise, setup } from 'xstate';
import api from '../api/chat.endpoint';
import type { Message, MessageObj } from '../types/chat.type';

export const chatMachine = setup({
	types: {
		context: {} as {
			question: Message;
			answer: Message;
			messageList: MessageObj[];
			state: 'idle' | 'processing' | 'complete';
		},
		events: {} as
			| {
					type: 'SUBMIT_EVENT';
			  }
			| {
					type: 'RECEIVE_ANSWER';
					answer: string;
			  }
			| {
					type: 'TYPING_QUESTION';
					question: string;
			  },
	},
	actors: {
		submitQuestion: fromPromise(
			async ({ input }: { input: { question: string } }) => {
				const response = await api.ask(input.question);
				return await response.json();
			},
		),
	},
	actions: {
		switchStateToIdle: assign({
			state: 'idle',
		}),
		switchStateToProcessing: assign({
			state: 'processing',
		}),
		switchStateToComplete: assign({
			state: 'complete',
		}),
		assignQuestion: assign({
			question: ({ event }) => {
				assertEvent(event, 'TYPING_QUESTION');
				return event.question;
			},
		}),
		assignQuestionToMessageList: assign({
			messageList: ({ event, context }) => {
				assertEvent(event, 'SUBMIT_EVENT');
				return [
					...context.messageList,
					{
						message: context.question,
						isMine: true,
					},
				];
			},
		}),
		resetQuestion: assign({
			question: '',
		}),
		assignErrorMessage: assign({
			answer: ({ event }) => {
				return '답변을 받아오는데 실패했습니다.';
			},
		}),
	},
}).createMachine({
	id: 'chatMachine',
	context: {
		question: '',
		answer: '',
		messageList: [],
		state: 'idle',
	},
	initial: 'EMPTY QUESTION FIELD',
	states: {
		'EMPTY QUESTION FIELD': {
			on: {
				TYPING_QUESTION: {
					target: 'FILLING QUESTION FIELD',
					actions: 'assignQuestion',
				},
			},
		},
		'FILLING QUESTION FIELD': {
			on: {
				TYPING_QUESTION: {
					actions: 'assignQuestion',
				},
				SUBMIT_EVENT: {
					target: 'SENDING QUESTION',
					actions: ['assignQuestionToMessageList', 'switchStateToProcessing'],
				},
			},
		},
		'SENDING QUESTION': {
			invoke: {
				src: 'submitQuestion',
				input: ({ context }) => ({ question: context.question }),
				onDone: {
					target: 'RECEIVED ANSWER',
					actions: [
						'switchStateToComplete',
						'resetQuestion',
						assign({
							messageList: ({ event, context }) => {
								return [
									...context.messageList,
									{ message: event.output, isMine: false },
								];
							},
						}),
					],
				},
				onError: {
					target: 'RECEIVED ANSWER',
					actions: ['assignErrorMessage'],
				},
			},
		},
		'RECEIVED ANSWER': {
			always: {
				target: 'EMPTY QUESTION FIELD',
				actions: ['switchStateToIdle'],
			},
		},
	},
});
