import { useEffect, useState } from 'react';
import stompClient from '~/shared/api/stompClient';
import type { CandlestickData, RowData } from '../types/tradeview.type';

export default function useRealTimeData() {
	const [data, setData] = useState<CandlestickData | null>(null);

	useEffect(() => {
		stompClient.onConnect = () => {
			stompClient.publish({
				destination: '/app/subscribe/realTimeOhlc',
				body: JSON.stringify({ ticker: 'BTC' }),
			});
			stompClient.subscribe('/topic/realTimeOhlc/BTC', (message) => {
				const parsedData = JSON.parse(message.body) as RowData;
				setData({
					Timestamp: Date.parse(parsedData.timestamp),
					Close: Number.parseFloat(parsedData.close),
					High: Number.parseFloat(parsedData.high),
					Low: Number.parseFloat(parsedData.low),
					Open: Number.parseFloat(parsedData.open),
					Volume: Number.parseFloat(parsedData.volume),
				});
			});
		};

		stompClient.onWebSocketError = (error) => {
			console.error('onWebSocketError');
			console.error(`error:${error}`);
		};

		stompClient.onStompError = (frame) => {
			console.error('onStompError');
			console.error(`Broker reported error: ${frame.headers.message}`);
			console.error(`Additional details: ${frame.body}`);
		};

		stompClient.activate();

		return () => {
			stompClient.deactivate();
		};
	}, []);

	return data;
}
