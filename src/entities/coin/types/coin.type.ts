import type { Response } from '~/shared/types/api';

export type CoinTicker = string;
export type CoinName = string;

export type CoinInfo = {
	ticker: CoinTicker;
	name: CoinName;
	svgIconBase64: string;
	currentPrice: number | null;
	changeRate: number | null;
};

export type CoinListResponseData = { assets: CoinInfo[] };
export type CoinListResponse = Response<CoinListResponseData>;
