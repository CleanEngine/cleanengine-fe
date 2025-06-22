import type { Time } from 'lightweight-charts';
import { useEffect, useState } from 'react';

import { useStompClient } from '~/app/provider/StompProvider';
import type { CoinTicker } from '~/entities/coin';
import type { CandlestickData, RawData } from '../types/tradeview.type';
import { timeToKrTz } from '../utils';

export default function useRealTimeData(ticker: CoinTicker) {
	const { client, connected } = useStompClient();
	const [data, setData] = useState<CandlestickData | null>(null);

	useEffect(() => {
		if (!client || !connected) return;

		client.publish({
			destination: '/app/subscribe/realTimeOhlc',
			body: JSON.stringify({ ticker }),
		});

		const subscription = client.subscribe(
			`/topic/realTimeOhlc/${ticker}`,
			(message) => {
				const parsedData = JSON.parse(message.body) as RawData;
				const parsedTime = timeToKrTz(parsedData.timestamp, 'Asia/Seoul');
				setData({
					time: parsedTime as Time,
					close: Number.parseFloat(parsedData.close),
					high: Number.parseFloat(parsedData.high),
					low: Number.parseFloat(parsedData.low),
					open: Number.parseFloat(parsedData.open),
				});
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [client, connected, ticker]);

	return data;
}
