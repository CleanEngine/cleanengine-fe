import { useEffect } from 'react';
import { toast } from 'react-toastify/unstyled';

import { useStompClient } from '~/app/provider/StompProvider';

type TradeNotification = {
	ticker: string;
	price: number;
	size: number;
	type: 'ask' | 'bid';
	tradedTime: string;
};

export default function useTradeNotification(userId: number) {
	const { client, connected } = useStompClient();

	useEffect(() => {
		if (!client || !connected || !userId) return;

		const subscription = client.subscribe(
			`/topic/tradeNotification/${userId}`,
			(message) => {
				const parsedData = JSON.parse(message.body) as TradeNotification;
				const tradeType = parsedData.type === 'ask' ? '매도' : '매수';
				const toastMessage = `${parsedData.ticker} ${tradeType} 체결 완료 - 가격: ${parsedData.price}, 수량: ${parsedData.size}`;
				toast.success(toastMessage);
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [client, connected, userId]);
}
