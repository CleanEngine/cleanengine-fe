import { useEffect, useState } from 'react';
import { toast } from 'react-toastify/unstyled';

import { useStompClient } from '~/app/provider/StompProvider';
import { api as userApi } from '~/entities/user';
import type { UserInfoResponse } from '~/entities/user/types/user.type';

type TradeNotification = {
	ticker: string;
	price: number;
	size: number;
	type: 'ask' | 'bid';
	tradedTime: string;
};

export default function useTradeNotification() {
	const { client, connected } = useStompClient();
	const [userId, setUserId] = useState<number | null>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const response = await userApi.getUserInfo();
				const { data } = await (response.json() as Promise<UserInfoResponse>);
				setUserId(data.userId);
			} catch (error) {
				console.error('Failed to fetch user info:', error);
				toast.error('사용자 정보를 가져오는데 실패했습니다.');
			}
		};

		fetchUserInfo();
	}, []);

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
