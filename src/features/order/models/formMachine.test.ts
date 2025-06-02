import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';
import { createActor } from 'xstate';

import { api as userApi } from '~/entities/user';
import { PRICE_STEP, QUANTITY_STEP } from '../const';
import { formMachine } from './form.machine';

vi.mock('~/entities/user', () => ({
	api: {
		getUserInfo: vi.fn(),
	},
}));

vi.mock('../api/order.endpoint', () => {
	return {
		default: {
			order: vi.fn().mockResolvedValue(true),
		},
	};
});

describe('formMachine 테스트', () => {
	beforeEach(() => {
		vi.resetAllMocks();

		const mockResponse = {
			json: vi.fn().mockResolvedValue({
				data: {
					cash: 100000,
					wallets: [
						{ ticker: 'BTC', size: 1.5 },
						{ ticker: 'ETH', size: 10 },
					],
				},
			}),
		};

		(userApi.getUserInfo as Mock).mockResolvedValue(mockResponse);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('초기에는 Empty Form 상태이다.', () => {
		const actor = createActor(formMachine);

		actor.start();

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.price).toBe(undefined);
		expect(actor.getSnapshot().context.quantity).toBe(undefined);
		expect(actor.getSnapshot().context.message).toBe('');
		expect(actor.getSnapshot().context.deposit).toBe(undefined);
		expect(actor.getSnapshot().context.holdings).toBe(undefined);
	});

	it('사용자의 자산을 로드한다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.price).toBe(undefined);
		expect(actor.getSnapshot().context.quantity).toBe(undefined);
		expect(actor.getSnapshot().context.message).toBe('');
		expect(actor.getSnapshot().context.deposit).toBe(undefined);
		expect(actor.getSnapshot().context.holdings).toBe(undefined);

		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		expect(actor.getSnapshot().context.deposit).toBe(100000);
		expect(actor.getSnapshot().context.holdings).toBe(1.5);
	});

	it('SWITCH_TRADE_TYPE 이벤트가 발생하면 tradeType이 변경된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		expect(actor.getSnapshot().value).toBe('Empty Form');

		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매도');

		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(userApi.getUserInfo).toHaveBeenCalledTimes(2);

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');

		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(userApi.getUserInfo).toHaveBeenCalledTimes(3);
	});

	it('SWITCH_ORDER_TYPE 이벤트가 발생하면 orderType이 변경된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		expect(actor.getSnapshot().value).toBe('Empty Form');

		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');

		actor.send({ type: 'SWITCH_ORDER_TYPE' });

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.orderType).toBe('시장가');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');

		actor.send({ type: 'SWITCH_ORDER_TYPE' });

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.tradeType).toBe('매도');

		actor.send({ type: 'SWITCH_ORDER_TYPE' });

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.orderType).toBe('시장가');
		expect(actor.getSnapshot().context.tradeType).toBe('매도');
	});

	//  매수 모드
	it('매수 모드에서 예수금이 없으면 에러 메시지가 표시된다.', async () => {
		const mockResponse = {
			json: vi.fn().mockResolvedValue({
				data: {
					cash: 0,
					wallets: [
						{ ticker: 'BTC', size: 1.5 },
						{ ticker: 'ETH', size: 10 },
					],
				},
			}),
		};

		(userApi.getUserInfo as Mock).mockResolvedValue(mockResponse);

		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_PRICE', price: 10000 });

		expect(actor.getSnapshot().context.price).toBe(10000);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.quantity).toBe(1);

		expect(actor.getSnapshot().context.message).toBe('예수금이 없습니다.');
	});

	it('매수 모드에서 가격과 수량을 변경할 수 있다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.price).toBe(undefined);
		expect(actor.getSnapshot().context.quantity).toBe(undefined);
		expect(actor.getSnapshot().context.message).toBe('');
		expect(actor.getSnapshot().context.deposit).toBe(undefined);
		expect(actor.getSnapshot().context.holdings).toBe(undefined);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);
		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매수');

		actor.send({ type: 'CHANGE_PRICE', price: 10000 });

		expect(actor.getSnapshot().value).toBe('Changed Form');
		expect(actor.getSnapshot().context.price).toBe(10000);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.quantity).toBe(1);
	});

	it('매수 모드에서 가격을 입력하지 않으면 에러 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.quantity).toBe(1);

		expect(actor.getSnapshot().context.message).toBe('구매가격이 없습니다.');
	});

	it('매수 모드에서 갯수를 입력하지 않으면 에러 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_PRICE', price: 10000 });

		expect(actor.getSnapshot().value).toBe('Changed Form');
		expect(actor.getSnapshot().context.price).toBe(10000);

		expect(actor.getSnapshot().context.message).toBe('구매수량이 없습니다.');
	});

	it('매수 모드에서 가지고 있는 예수금보다 많은 가격을 입력하면 에러 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_PRICE', price: 1000000 });

		expect(actor.getSnapshot().value).toBe('Changed Form');
		expect(actor.getSnapshot().context.price).toBe(1000000);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.message).toBe(
			'구매가격 * 수량이 예수금보다 작아야 합니다.',
		);
	});

	//  매도 모드

	it('매도 모드에서 보유한 수량이 없으면 에러 메시지가 표시된다.', async () => {
		const mockResponse = {
			json: vi.fn().mockResolvedValue({
				data: {
					cash: 100000,
					wallets: [
						{ ticker: 'BTC', size: 0 },
						{ ticker: 'ETH', size: 10 },
					],
				},
			}),
		};

		(userApi.getUserInfo as Mock).mockResolvedValue(mockResponse);

		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(2);

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매도');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.price).toBe(undefined);
		expect(actor.getSnapshot().context.quantity).toBe(undefined);
		expect(actor.getSnapshot().context.message).toBe('');
		expect(actor.getSnapshot().context.deposit).toBe(100000);
		expect(actor.getSnapshot().context.holdings).toBe(0);

		actor.send({ type: 'CHANGE_PRICE', price: 1000 });

		expect(actor.getSnapshot().value).toBe('Changed Form');
		expect(actor.getSnapshot().context.price).toBe(1000);
		expect(actor.getSnapshot().context.message).toBe(
			'보유하신 수량이 없습니다.',
		);
	});

	it('매도 모드에서 가격과 수량을 변경할 수 있다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(2);

		expect(actor.getSnapshot().value).toBe('Empty Form');
		expect(actor.getSnapshot().context.tradeType).toBe('매도');
		expect(actor.getSnapshot().context.orderType).toBe('지정가');
		expect(actor.getSnapshot().context.price).toBe(undefined);
		expect(actor.getSnapshot().context.quantity).toBe(undefined);
		expect(actor.getSnapshot().context.message).toBe('');
		expect(actor.getSnapshot().context.deposit).toBe(100000);
		expect(actor.getSnapshot().context.holdings).toBe(1.5);

		actor.send({ type: 'CHANGE_PRICE', price: 1000 });
		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().value).toBe('Changed Form');
		expect(actor.getSnapshot().context.price).toBe(1000);
		expect(actor.getSnapshot().context.quantity).toBe(1);
	});

	it('매도 모드에서 가격을 입력하지 않으면 에러 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(2);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.quantity).toBe(1);

		expect(actor.getSnapshot().context.message).toBe(
			'0이하의 가격에는 매도할 수 없습니다.',
		);
	});

	it('매도 모드에서 보유한 수량보다 많은 수량을 입력하면 에러 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(2);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 2 });

		expect(actor.getSnapshot().context.quantity).toBe(2);

		expect(actor.getSnapshot().context.message).toBe(
			'보유하신 수량보다 많은 수량은 매도할 수 없습니다.',
		);
	});

	it('매도 모드에서 가격이 0이하이면 에러 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'SWITCH_TRADE_TYPE' });

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(2);

		actor.send({ type: 'CHANGE_PRICE', price: 0 });

		expect(actor.getSnapshot().context.price).toBe(0);

		expect(actor.getSnapshot().context.message).toBe(
			'0이하의 가격에는 매도할 수 없습니다.',
		);
	});

	it('가격이 설정되있고 incrementPrice를 호출하면 단위 가격만큼 가격이 증가한다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_PRICE', price: 10000 });

		expect(actor.getSnapshot().context.price).toBe(10000);

		actor.send({ type: 'INCREMENT_PRICE' });

		expect(actor.getSnapshot().context.price).toBe(10000 + PRICE_STEP);
	});

	it('가격이 설정되있고 decrementPrice를 호출하면 단위 가격만큼 가격이 감소한다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_PRICE', price: 10000 });

		expect(actor.getSnapshot().context.price).toBe(10000);

		actor.send({ type: 'DECREMENT_PRICE' });

		expect(actor.getSnapshot().context.price).toBe(10000 - PRICE_STEP);
	});

	it('갯수가 설정되있고 incrementQuantity를 호출하면 단위 갯수만큼 갯수가 증가한다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.quantity).toBe(1);

		actor.send({ type: 'INCREMENT_QUANTITY' });

		expect(actor.getSnapshot().context.quantity).toBe(1 + QUANTITY_STEP);
	});

	it('갯수가 설정되있고 decrementQuantity를 호출하면 단위 갯수만큼 갯수가 감소한다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.quantity).toBe(1);

		actor.send({ type: 'DECREMENT_QUANTITY' });

		expect(actor.getSnapshot().context.quantity).toBe(1 - QUANTITY_STEP);
	});

	it('submitForm이 성공적으로 호출되면 성공 메시지가 표시된다.', async () => {
		const actor = createActor(formMachine, {
			input: {
				ticker: 'BTC',
			},
		});

		actor.start();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(userApi.getUserInfo).toHaveBeenCalledTimes(1);

		actor.send({ type: 'CHANGE_PRICE', price: 1000 });
		actor.send({ type: 'CHANGE_QUANTITY', quantity: 1 });

		expect(actor.getSnapshot().context.price).toBe(1000);
		expect(actor.getSnapshot().context.quantity).toBe(1);
		expect(actor.getSnapshot().context.message).toBe('');

		actor.send({ type: 'SUBMIT_FORM' });

		expect(actor.getSnapshot().value).toBe('Submitting Form');
		expect(actor.getSnapshot().context.message).toBe('');

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(actor.getSnapshot().value).toBe('Showing Success Message');
	});
});
