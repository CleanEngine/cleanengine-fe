import { useCallback, useEffect, useState } from 'react';
import api from '../api/tradeview.endpoints';
import type { RawData } from '../types/tradeview.type';

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

export default function usePastTimeData(
	ticker = 'BTC',
	interval = 1,
	count = 100,
	from?: string,
) {
	const [pastTimeData, setPastTimeData] = useState<RawData[]>([]);

	const fetchData = useCallback(async () => {
		const response = await api.getPastData(ticker, interval, count, from);
		const data = await response.json();

		setPastTimeData(data);
	}, [ticker, interval, count, from]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return pastTimeData;
}
