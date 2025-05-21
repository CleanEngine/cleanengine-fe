import { useEffect, useState } from 'react';
import { useStompClient } from '~/app/provider/StompProvider';

type CurrentPriceData = {
	changeRate: number;
	currentPrice: number;
	prevClose: number;
	ticker: string;
	timestamp: string;
};

export default function useCurrentPrice(ticker: string) {
	const { client, connected } = useStompClient();
	const [data, setData] = useState<CurrentPriceData | null>(null);

	useEffect(() => {
		if (!client || !connected) return;

		client.publish({
			destination: `/app/subscribe/prevRate/${ticker}`,
			body: JSON.stringify({ ticker }),
		});

		const subscription = client.subscribe(
			`/topic/prevRate/${ticker}`,
			(message) => {
				const parsedData = JSON.parse(message.body);
				setData(parsedData);
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [client, connected, ticker]);

	return data;
}
