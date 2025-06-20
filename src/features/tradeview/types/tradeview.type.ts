import type { Time } from 'lightweight-charts';

export type RawData = {
	ticker: string;
	timestamp: string;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
};

export type CandlestickData = {
	time: Time;
	close: number;
	high: number;
	low: number;
	open: number;
};
