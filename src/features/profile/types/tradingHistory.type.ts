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

export type TradingHistory =
	| {
			// 지정가 매도
			side: Side.ASK;
			orderStatus:
				| OrderStatus.UNSETTLED
				| OrderStatus.SETTLED
				| OrderStatus.IN_PROGRESS;
			orderType: OrderType.LIMIT;
			orderId: string;
			ticker: string;
			name: string;
			price: number;
			orderSize: number;
			remainingSize: number;
			displaySize: number;
			tradeTime: string;
	  }
	| {
			// 시장가 매도
			side: Side.ASK;
			orderStatus:
				| OrderStatus.UNSETTLED
				| OrderStatus.SETTLED
				| OrderStatus.IN_PROGRESS;
			orderType: OrderType.MARKET;
			orderId: string;
			ticker: string;
			name: string;
			orderSize: number;
			remainingSize: number;
			displaySize: number;
			tradeTime: string;
	  }
	| {
			// 지정가 매수
			side: Side.BID;
			orderStatus:
				| OrderStatus.UNSETTLED
				| OrderStatus.SETTLED
				| OrderStatus.IN_PROGRESS;
			orderType: OrderType.LIMIT;
			orderId: string;
			ticker: string;
			name: string;
			price: number;
			orderSize: number;
			remainingSize: number;
			displaySize: number;
			tradeTime: string;
	  }
	| {
			// 시장가 매수
			side: Side.BID;
			orderStatus:
				| OrderStatus.UNSETTLED
				| OrderStatus.SETTLED
				| OrderStatus.IN_PROGRESS;
			orderType: OrderType.MARKET;
			orderId: string;
			ticker: string;
			name: string;
			price: number;
			tradeTime: string;
	  };

export type HistoryResonseData = {
	orderList: TradingHistory[];
	totalPages: number;
	currentPage: number;
	pageSize: number;
	totalElements: number;
};

export type HistoryResponse = Response<HistoryResonseData>;
