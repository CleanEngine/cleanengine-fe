import { useCallback, useEffect, useState } from 'react';
import type { CandlestickData } from './useRealTimeData';

export type UpbitCandle = {
	market: string;
	candle_date_time_utc: string;
	candle_date_time_kst: string;
	opening_price: number;
	high_price: number;
	low_price: number;
	trade_price: number;
	timestamp: number;
	candle_acc_trade_price: number;
	candle_acc_trade_volume: number;
	unit: number;
};

export default function usePastTimeData() {
	const [pastTimeData, setPastTimeData] = useState<CandlestickData[]>([]);

	const fetchData = useCallback(async () => {
		const response = await fetch(
			'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=200',
		);
		const data: UpbitCandle[] = await response.json();
		setPastTimeData(
			data.map((datum) => ({
				Timestamp: datum.timestamp,
				Close: datum.trade_price,
				High: datum.high_price,
				Low: datum.low_price,
				Open: datum.opening_price,
				Volume: datum.candle_acc_trade_volume,
			})),
		);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return pastTimeData;
}
