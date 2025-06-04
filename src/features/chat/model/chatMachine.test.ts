import { type Mock, describe, expect, it, vi } from 'vitest';
import { createActor } from 'xstate';
import api from '../api/chat.endpoint';
import { chatMachine } from './chat.machine';

const mockResponse = {
	json: vi.fn().mockResolvedValue('응답이 돌아왔습니다.'),
};

const mockRejectResponse = {
	json: vi.fn().mockRejectedValue(new Error('에러가 발생했습니다.')),
};

vi.mock('../api/chat.endpoint', () => {
	return {
		default: {
			ask: vi.fn(),
		},
	};
});

describe('chatMachine 테스트', () => {
	it('처음 상태는 idle이다', () => {
		const actor = createActor(chatMachine);

		actor.start();

		expect(actor.getSnapshot().value).toBe('EMPTY QUESTION FIELD');
		expect(actor.getSnapshot().context.state).toBe('idle');
	});

	it('사용자가 입력을 하면 FILLING QUESTION FIELD 상태로 이동한다.', () => {
		const actor = createActor(chatMachine);

		actor.start();

		actor.send({ type: 'TYPING_QUESTION', question: 'test' });

		expect(actor.getSnapshot().value).toBe('FILLING QUESTION FIELD');
		expect(actor.getSnapshot().context.question).toBe('test');
	});

	it('사용자가 전송을 하면 SENDING QUESTION 상태로 이동한다.', () => {
		const actor = createActor(chatMachine);

		actor.start();

		actor.send({ type: 'TYPING_QUESTION', question: 'test' });

		expect(actor.getSnapshot().value).toBe('FILLING QUESTION FIELD');
		expect(actor.getSnapshot().context.question).toBe('test');

		actor.send({ type: 'SUBMIT_EVENT' });

		expect(actor.getSnapshot().value).toBe('SENDING QUESTION');

		expect(actor.getSnapshot().context.messageList).toEqual([
			{
				message: 'test',
				isMine: true,
			},
		]);
	});

	it('사용자가 정상적인 응답을 받으면 응답을 messageList에 추가하고 EMPTY QUESTION FIELD 상태로 이동한다.', async () => {
		(api.ask as Mock).mockResolvedValue(mockResponse);
		const actor = createActor(chatMachine);

		actor.start();

		actor.send({ type: 'TYPING_QUESTION', question: 'test' });

		expect(actor.getSnapshot().value).toBe('FILLING QUESTION FIELD');
		expect(actor.getSnapshot().context.question).toBe('test');

		actor.send({ type: 'SUBMIT_EVENT' });

		expect(actor.getSnapshot().value).toBe('SENDING QUESTION');

		await new Promise<void>((resolve) => {
			const subscription = actor.subscribe((state) => {
				if (state.matches('EMPTY QUESTION FIELD')) {
					subscription.unsubscribe();
					resolve();
				}
			});
		});

		expect(actor.getSnapshot().value).toBe('EMPTY QUESTION FIELD');
		expect(actor.getSnapshot().context.messageList).toEqual([
			{
				message: 'test',
				isMine: true,
			},
			{
				message: '응답이 돌아왔습니다.',
				isMine: false,
			},
		]);
	});

	it('사용자가 비정상적인 응답을 받으면 에러 메시지를 messageList에 추가하고 EMPTY QUESTION FIELD 상태로 이동한다.', async () => {
		(api.ask as Mock).mockRejectedValue(mockRejectResponse);
		const actor = createActor(chatMachine);

		actor.start();

		actor.send({ type: 'TYPING_QUESTION', question: 'test' });

		expect(actor.getSnapshot().value).toBe('FILLING QUESTION FIELD');
		expect(actor.getSnapshot().context.question).toBe('test');

		actor.send({ type: 'SUBMIT_EVENT' });

		expect(actor.getSnapshot().value).toBe('SENDING QUESTION');

		await new Promise<void>((resolve) => {
			const subscription = actor.subscribe((state) => {
				if (state.matches('EMPTY QUESTION FIELD')) {
					subscription.unsubscribe();
					resolve();
				}
			});
		});

		expect(actor.getSnapshot().value).toBe('EMPTY QUESTION FIELD');
		expect(actor.getSnapshot().context.messageList).toEqual([
			{
				message: 'test',
				isMine: true,
			},
			{
				message: '답변을 받아오는데 실패했습니다.',
				isMine: false,
			},
		]);
	});
});
