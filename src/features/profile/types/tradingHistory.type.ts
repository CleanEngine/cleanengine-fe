import type { Response } from '~/shared/types/api';

export type TradingHistory =
	| {
			orderId: string;
			side: 'ask';
			orderType: 'limit';
			ticker: string;
			size: number;
			price: number;
			status: 'unsettled' | 'settled' | 'in_progress';
	  }
	| {
			orderId: string;
			side: 'ask';
			orderType: 'market';
			ticker: string;
			size: number;
			status: 'unsettled' | 'settled' | 'in_progress';
	  }
	| {
			orderId: string;
			side: 'bid';
			orderType: 'limit';
			ticker: string;
			size: number;
			price: number;
			status: 'unsettled' | 'settled' | 'in_progress';
	  }
	| {
			orderId: string;
			side: 'bid';
			orderType: 'market';
			ticker: string;
			price: number;
			status: 'unsettled' | 'settled' | 'in_progress';
	  };

export type History = {
	data: TradingHistory[];
	next: number;
	last: number;
};

export type HistoryResponse = Response<History>;
