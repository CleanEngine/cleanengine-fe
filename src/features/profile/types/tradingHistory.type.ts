import type { Response } from '~/shared/types/api';

// 지정가/시장가
export enum OrderType {
	LIMIT = 'LIMIT',
	MARKET = 'MARKET',
}

// 매수/매도
export enum Side {
	ASK = 'ASK',
	BID = 'BID',
}

// 주문 상태
export enum OrderStatus {
	UNSETTLED = 'UNSETTLED',
	SETTLED = 'SETTLED',
	IN_PROGRESS = 'IN_PROGRESS',
}

type BaseOrder = {
	orderId: string;
	ticker: string;
	name: string;
	remainingSize: number;
	displaySize: number;
	tradeTime: string;
	orderStatus:
		| OrderStatus.UNSETTLED
		| OrderStatus.SETTLED
		| OrderStatus.IN_PROGRESS;
};

export type TradingHistory = BaseOrder &
	(
		| {
				side: Side.ASK;
				orderType: OrderType.LIMIT;
				price: number;
				orderSize: number;
		  }
		| { side: Side.ASK; orderType: OrderType.MARKET; orderSize: number }
		| {
				side: Side.BID;
				orderType: OrderType.LIMIT;
				price: number;
				orderSize: number;
		  }
		| { side: Side.BID; orderType: OrderType.MARKET; price: number }
	);

export type HistoryResponseData = {
	orderList: TradingHistory[];
	totalPages: number;
	currentPage: number;
	pageSize: number;
	totalElements: number;
};

export type HistoryResponse = Response<HistoryResponseData>;
