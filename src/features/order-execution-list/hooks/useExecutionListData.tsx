import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import type { Execution } from '../types/execution.type';

export default function useExecutionListData(ticker = 'TRUMP') {
	const [executionList, setExecutionList] = useState<Execution[]>([]);

	useEffect(() => {
		const client = new Client({
			brokerURL: `${import.meta.env.VITE_STOMP_URL}/api/coin/realtime`,
		});

		client.onConnect = () => {
			client.publish({
				destination: '/app/subscribe/realTimeTradeRate',
				body: JSON.stringify({ ticker }),
			});

			client.subscribe(`/topic/realTimeTradeRate/${ticker}`, (message) => {
				const parsedData = JSON.parse(message.body) as Execution;
				setExecutionList((prev) => [parsedData, ...prev].slice(0, 30));
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

	return executionList;
}
