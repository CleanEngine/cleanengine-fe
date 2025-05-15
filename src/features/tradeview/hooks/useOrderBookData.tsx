import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import type { OrderBookData, RawOrderBookData } from '../types/orderbook.type';

export default function useOrderBookData(ticker = 'TRUMP') {
	const [data, setData] = useState<OrderBookData>();

	useEffect(() => {
		const client = new Client({
			brokerURL: `${import.meta.env.VITE_STOMP_URL}/coin/realtime`,
		});

		client.onConnect = () => {
			client.subscribe(`/topic/orderbook/${ticker}`, (message) => {
				const parsedData = JSON.parse(message.body) as RawOrderBookData;
				setData({
					ticker: parsedData.ticker,
					buyOrderBookUnits: parsedData.buyOrderBookUnits.map((unit) => ({
						price: String(unit.price),
						size: Number(unit.size),
					})),
					sellOrderBookUnits: parsedData.sellOrderBookUnits.map((unit) => ({
						price: String(unit.price),
						size: Number(unit.size),
					})),
				});
			});
		};

		client.onWebSocketError = (error) => {
			console.error('onWebSocketError');
			console.error(`error:${error}`);
			if (error instanceof Error) {
				console.error(error.message);
			}
		};

		client.onStompError = (frame) => {
			console.error('onStompError');
			console.error(`Broker reported error: ${frame.headers.message}`);
			console.error(`Additional details: ${frame.body}`);
		};

		client.activate();

		return () => {
			client.deactivate();
		};
	}, [ticker]);

	return data;
}
