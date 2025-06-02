import { assertEvent, assign, fromPromise, setup } from 'xstate';
import { api as userApi } from '~/entities/user';
import orderApi from '../api/order.endpoint';
import { PRICE_STEP, QUANTITY_STEP } from '../const';

export const formMachine = setup({
	types: {
		context: {} as {
			ticker: string;
			tradeType: '매수' | '매도';
			orderType: '지정가' | '시장가';
			price?: number;
			quantity?: number;
			message: string;
			deposit?: number;
			holdings?: number;
		},
		events: {} as
			| { type: 'SWITCH_TRADE_TYPE' }
			| { type: 'SWITCH_ORDER_TYPE' }
			| { type: 'CHANGE_PRICE'; price: number }
			| { type: 'CHANGE_QUANTITY'; quantity: number }
			| { type: 'INCREMENT_PRICE' }
			| { type: 'DECREMENT_PRICE' }
			| { type: 'INCREMENT_QUANTITY' }
			| { type: 'DECREMENT_QUANTITY' }
			| { type: 'SUBMIT_FORM' }
			| { type: 'SHOW_SUCCESS_MESSAGE' }
			| { type: 'SHOW_ERROR_MESSAGE' },
	},
	actors: {
		loadDepositAndHoldings: fromPromise(
			async ({ input }: { input: { ticker: string } }) => {
				const response = await userApi.getUserInfo();
				const { data } = await response.json();

				const holdings = Number(
					data.wallets.find((wallet) => wallet.ticker === input.ticker)?.size ||
						0,
				);

				return {
					deposit: data.cash,
					holdings,
				};
			},
		),

		submitForm: fromPromise(
			async ({
				input,
			}: {
				input: {
					ticker: string;
					side: 'bid' | 'ask';
					orderType: 'limit' | 'market';
					orderSize?: number;
					price?: number;
					errorMessage: string;
				};
			}) => {
				if (input.errorMessage.length > 0) throw new Error(input.errorMessage);
				return orderApi.order({
					ticker: input.ticker,
					side: input.side,
					orderType: input.orderType,
					orderSize: input.orderSize,
					price: input.price,
				});
			},
		),
	},
	actions: {
		switchTradeType: assign({
			tradeType: ({ context }) => {
				return context.tradeType === '매수' ? '매도' : '매수';
			},
		}),
		switchOrderType: assign({
			orderType: ({ context }) => {
				return context.orderType === '지정가' ? '시장가' : '지정가';
			},
			price: ({ context }) => {
				if (context.tradeType === '매도') return undefined;

				return context.price;
			},
			quantity: ({ context }) => {
				if (context.tradeType === '매수') return undefined;

				return context.quantity;
			},
		}),
		changePrice: assign({
			price: ({ event }) => {
				assertEvent(event, 'CHANGE_PRICE');
				return event.price;
			},

			message: ({ event, context }) => {
				assertEvent(event, 'CHANGE_PRICE');

				const quantity = context.quantity || 0;
				const price = event.price;

				if (context.tradeType === '매수') {
					if (!context.deposit) return '예수금이 없습니다.';

					if (price <= 0) return '구매가격이 없습니다.';

					if (context.orderType === '시장가') return '';

					if (quantity <= 0) return '구매수량이 없습니다.';

					if (price * quantity > context.deposit)
						return '구매가격 * 수량이 예수금보다 작아야 합니다.';
				} else {
					if (!context.holdings) return '보유하신 수량이 없습니다.';

					if (context.holdings < quantity)
						return '보유하신 수량보다 많은 수량은 매도할 수 없습니다.';

					if (context.orderType === '시장가') return '';

					if (price <= 0) return '0이하의 가격에는 매도할 수 없습니다.';
				}

				return '';
			},
		}),
		changeQuantity: assign({
			quantity: ({ event }) => {
				assertEvent(event, 'CHANGE_QUANTITY');
				return event.quantity;
			},

			message: ({ event, context }) => {
				assertEvent(event, 'CHANGE_QUANTITY');

				const quantity = event.quantity;
				const price = context.price || 0;

				if (context.tradeType === '매수') {
					if (!context.deposit) return '예수금이 없습니다.';

					if (quantity <= 0) return '구매수량이 없습니다.';

					if (price <= 0) return '구매가격이 없습니다.';

					if (price * quantity > context.deposit)
						return '구매가격 * 수량이 예수금보다 작아야 합니다.';
				} else {
					if (!context.holdings) return '보유하신 수량이 없습니다.';

					if (context.holdings < quantity)
						return '보유하신 수량보다 많은 수량은 매도할 수 없습니다.';

					if (context.orderType === '시장가') return '';

					if (price <= 0) return '0이하의 가격에는 매도할 수 없습니다.';
				}

				return '';
			},
		}),
		incrementPrice: assign({
			price: ({ context }) => {
				if (typeof context.price === 'undefined') return undefined;

				return context.price + PRICE_STEP;
			},
		}),
		decrementPrice: assign({
			price: ({ context }) => {
				if (typeof context.price === 'undefined') return undefined;

				const nextPrice = context.price - PRICE_STEP;
				if (nextPrice <= 0) return 0;

				return nextPrice;
			},
		}),
		incrementQuantity: assign({
			quantity: ({ context }) => {
				if (typeof context.quantity === 'undefined') return undefined;

				return context.quantity + QUANTITY_STEP;
			},
		}),
		decrementQuantity: assign({
			quantity: ({ context }) => {
				if (typeof context.quantity === 'undefined') return undefined;

				const nextQuantity = context.quantity - QUANTITY_STEP;
				if (nextQuantity <= 0) return 0;

				return nextQuantity;
			},
		}),
		resetForm: assign({
			price: undefined,
			quantity: undefined,
			message: '',
			tradeType: '매수',
			orderType: '지정가',
		}),
	},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDCYBiB7VAtgLLoDGAFgJYB2YAdAKIEAOyAngAQBCArp3oQDEAZQDqASQAqAYQASAfUkAlAIIARBooCaABQYBtAAwBdRKGa5YlZJVzUzIAB6IAzABYArHTcAOAJwePh5+fgDsAIzhAGw+ADQgbK4+hnR+hm5+4cF+AEyZOVEAvoXxaJg4+MRkVLSMLOzcfBwCBCISMgoA8koaStp6RqZIIBZWNnYOzgihPnSGhoEuHoahLoYuOaHxiQibXuGGPgehUVk+oTnhxaUYWC0kFDT0TKycvPyVgnIqAHIA4pouABVLTyHRKcTSAwmByjay2ezDKbuLy+AJBEIRaJxBKISKrOYXGYBAJ5GbXEBlO6VB41Z71N5NFpfWS-AHyYGggCKQN+kikWkGsMs8ImSNcnm8-kC2SxMW2eJWoTooT8yXCPjcnkMOS1FKpFUItKedVeHGEYAANpbmp8xFI5IpVBp+tChuYReNEaApj4XMrljMPLqQwdwgrdv6VVFQh41m5wqEk1Edfrboaqo9ai8GhbrbahPaOvJur1XULhnCvZNFTE6AcdcswkFdRGDn4XHR3NFwm5Qm5Nm5DFcSpT0-dqiac5w8zbmd9-pphAwADIrsEQqEVj1jBE1hDhHL+OgeGYHTxHCJRHJtw7hOg+KJDqLLFO6qIuNPlCdZ+lm2cFq0C7ssua7yDyfICtuIyenu4oHkefgnme6SBIm0Q3riB6Jsq4QuD4frXgcHjhAEX7Ukak61NI5DoNQMAQI0HyFu0jrKOomiSLobrCruYo+ogfoBisRyGLkHgfqsbZZEhJweH2QQkSsbjkRmxrUbR9GQExgFtA6XQ9AwfRcQMMKVrB-FOIgKadicA5+DGMZqr2t4BHQURpDMmqHvMviqT+dJ0DRdEMTp86souHIghukI8eZfHelZCAprMmq6kmh6xocmE7A2KQJimiYFImLiJv5NJUfQwVaYx7y6cBgLRRBPz8lx0FVnBAkIME94ZI+apuKc-pbFhaT7Am76RL2MrlZRv5BZpoV1cy4g-NISgMEQDAtTFW5mTuoqJVMpxRF2L45O4UQxnhHgRskSGPk+-YOZEQSfqOBoBSa1VLUynwaOtm3bZIu1xQd1bwUNqS5NEIQ6h5I07BEbgnpkoTrKJ+Qjjc34VfNP3actnyrYDW07c1rWCvtMEJfu2RzJcngpsO8z4RGpxIaVHkbFdhgfn4s2ZoFBO1X9QgAxtZMgxTUHUx1llTMEp1PpqGyrCR+FRBGwYo+kF3DhJyQZDkgvqVVi3aQBzJFmxzqcdx7UWUdeKlZzAQXHhHbzDiOxHF2ORHuj7ZXR5Him5VC0hZbVpznarEGWWJlgzTh37lkT7ePJGxxiGfaucqQ4nKsySxi4-rh-jFuMVbnwNfIoHruCsWO7T8Hp8qZekREF3BB4fe3jq9Zl3ryN+G4LgCx94548LVfmjH9URSBq7rjLbVy07afyUhao+DkOpj1qMa3aNfMPoEmzp4N6M+BXs9R9XC8rWtkvA6DLep23p7KgswYbGJY8sR3UiCeQiQ4+z73unfb6c8a7iwYKTN+Tc9ruhThDLqWR+zuT3qRTUgQHJHgjFeLshx+obA1EqaBGkH7z3zM-RB5NeQtVlqg+WzsDx91kpEYMKY+5pRcOzS4cx3BiUvFkFEVDzY0Lga0CWQNGGQXXqwzeX9TxdnwuPYcMY+y+G1jkLwsYOybB1IeU4KkKTUFwFgeAwxPozyeLxT+XUAC04YsLOKKFPXGc1ArTjCpURx6Ckp5ywv6Lw+FNj4RvoNUi5icYUSFlOBktDY6EECZ1JK7ZOz4RCDEAiYkxI5TxKRTsJ18L4LWHhd68S1IRxFv4tJ8UnFJVOLMGIRElidP0X4aSbkHLyVIssTwY9PE1K+tQmqKTALpIVniU8O8YhBxfAmTIbhenKhiLqLU7sS7FGKEAA */
	id: 'tradeFormMachine',
	initial: 'Empty Form',

	context: (params) => {
		const ticker =
			typeof params.input === 'object' && params.input
				? (params.input as { ticker?: string }).ticker || ''
				: '';

		return {
			tradeType: '매수',
			orderType: '지정가',
			message: '',
			ticker,
		};
	},
	states: {
		'Empty Form': {
			on: {
				SWITCH_TRADE_TYPE: {
					target: 'Empty Form',
					actions: 'switchTradeType',
					reenter: true,
				},
				SWITCH_ORDER_TYPE: {
					target: 'Empty Form',
					actions: 'switchOrderType',
				},
				CHANGE_PRICE: {
					target: 'Changed Form',
					actions: 'changePrice',
				},
				CHANGE_QUANTITY: {
					target: 'Changed Form',
					actions: 'changeQuantity',
				},
			},
			invoke: {
				src: 'loadDepositAndHoldings',
				input: ({ context }) => ({ ticker: context.ticker }),
				onDone: {
					actions: assign({
						deposit: ({ event }) => event.output.deposit,
						holdings: ({ event }) => event.output.holdings,
					}),
				},
				onError: {
					actions: assign({
						message: '사용자의 계좌정보를 받아오는데 실패했습니다.',
					}),
				},
			},
		},
		'Changed Form': {
			on: {
				SWITCH_TRADE_TYPE: {
					target: 'Empty Form',
					actions: ['resetForm', 'switchTradeType'],
				},
				SWITCH_ORDER_TYPE: {
					target: 'Changed Form',
					actions: 'switchOrderType',
				},
				CHANGE_PRICE: {
					target: 'Changed Form',
					actions: 'changePrice',
				},
				CHANGE_QUANTITY: {
					target: 'Changed Form',
					actions: 'changeQuantity',
				},
				INCREMENT_PRICE: {
					target: 'Changed Form',
					actions: 'incrementPrice',
				},
				DECREMENT_PRICE: {
					target: 'Changed Form',
					actions: 'decrementPrice',
				},
				INCREMENT_QUANTITY: {
					target: 'Changed Form',
					actions: 'incrementQuantity',
				},
				DECREMENT_QUANTITY: {
					target: 'Changed Form',
					actions: 'decrementQuantity',
				},
				SUBMIT_FORM: {
					target: 'Submitting Form',
				},
			},
		},
		'Submitting Form': {
			invoke: {
				src: 'submitForm',
				input: ({ context }) => ({
					ticker: context.ticker,
					side: context.tradeType === '매수' ? 'bid' : 'ask',
					orderType: context.orderType === '지정가' ? 'limit' : 'market',
					orderSize: context.quantity,
					price: context.price,
					errorMessage: context.message,
				}),

				onDone: {
					target: 'Showing Success Message',
					actions: assign(({ context }) => {
						const message = `${context.orderType}로 ${context.tradeType} 요청에 성공했습니다.`;
						return { message };
					}),
				},
				onError: {
					target: 'Showing Error Message',
				},
			},
		},
		'Showing Success Message': {
			after: {
				100: {
					target: 'Empty Form',
					actions: ['resetForm'],
				},
			},
		},
		'Showing Error Message': {
			after: {
				100: {
					target: 'Empty Form',
					actions: ['resetForm'],
				},
			},
		},
	},
});
