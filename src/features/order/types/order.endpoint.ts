import type { Response } from '~/shared/types/api';

export type TradeType = '매수' | '매도';
export type OrderType = '지정가' | '시장가';

type OrderState = 'WAIT' | 'DONE' | 'CANCEL';

export type OrderResponseData = {
	orderId: number;
	ticker: string;
	state: OrderState;
	userId: number;
	orderType: 'bid' | 'ask';
	lockedDeposit: number;
	orderSize: number;
	price: number;
	createAt: string;
};

export type OrderResponse = Response<OrderResponseData>;

export type OrderRequestData = {
	ticker: string;
	side: 'bid' | 'ask';
	orderType: 'limit' | 'market';
	orderSize?: number;
	price?: number;
};
