import { useEffect, useState } from 'react';

import { useStompClient } from '~/app/provider/StompProvider';
import type { CoinTicker } from '~/entities/coin';
import type { OrderBookData, RawOrderBookData } from '../types/orderbook.type';

export default function useOrderBookData(ticker: CoinTicker) {
	const { client, connected } = useStompClient();
	const [data, setData] = useState<OrderBookData>();

	useEffect(() => {
		if (!client || !connected) return;
		client.publish({
			destination: '/app/subscribe/orderbook',
			body: JSON.stringify({ ticker }),
		});
		const subscription = client.subscribe(
			`/topic/orderbook/${ticker}`,
			(message) => {
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
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [client, connected, ticker]);

	return data;
}
