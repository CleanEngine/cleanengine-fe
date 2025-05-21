import { useEffect, useState } from 'react';
import { useStompClient } from '~/app/provider/StompProvider';
import type { CandlestickData, RowData } from '../types/tradeview.type';

export default function useRealTimeData(ticker = 'TRUMP') {
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
				const parsedData = JSON.parse(message.body) as RowData;
				setData({
					Timestamp: Date.parse(parsedData.timestamp),
					Close: Number.parseFloat(parsedData.close),
					High: Number.parseFloat(parsedData.high),
					Low: Number.parseFloat(parsedData.low),
					Open: Number.parseFloat(parsedData.open),
					Volume: Number.parseFloat(parsedData.volume),
				});
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [client, connected, ticker]);

	return data;
}
