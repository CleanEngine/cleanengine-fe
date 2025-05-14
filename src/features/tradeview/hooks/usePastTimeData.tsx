import { useCallback, useEffect, useState } from 'react';
import api from '../api/tradeview.endpoints';
import type { CandlestickData } from '../types/tradeview.type';

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
		const response = await api.getPastData();
		const data = await response.json();

		setPastTimeData(
			data.map((datum) => ({
				Timestamp: Date.parse(datum.timestamp),
				Close: Number.parseFloat(datum.close),
				High: Number.parseFloat(datum.high),
				Low: Number.parseFloat(datum.low),
				Open: Number.parseFloat(datum.open),
				Volume: Number.parseFloat(datum.volume),
			})),
		);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return pastTimeData;
}
