import { useEffect, useState } from 'react';

import { useStompClient } from '~/app/provider/StompProvider';
import type { CoinTicker } from '~/entities/coin';
import type { Execution } from '../types/execution.type';

export default function useExecutionListData(ticker: CoinTicker) {
	const { client, connected } = useStompClient();
	const [executionList, setExecutionList] = useState<Execution[]>([]);

	useEffect(() => {
		if (!client || !connected) return;

		client.publish({
			destination: `/app/subscribe/realTimeTradeRate/${ticker}`,
			body: JSON.stringify({ ticker }),
		});

		const subscription = client.subscribe(
			`/topic/realTimeTradeRate/${ticker}`,
			(message) => {
				const parsedData = JSON.parse(message.body) as Execution;
				setExecutionList((prev) => [parsedData, ...prev].slice(0, 30));
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [client, connected, ticker]);

	return executionList;
}
