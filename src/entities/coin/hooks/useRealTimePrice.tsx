import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';

export default function useRealTimePrice(ticker = 'TRUMP') {
	useEffect(() => {
		const client = new Client({
			brokerURL: `${import.meta.env.VITE_STOMP_URL}/coin/realtime`,
		});

		client.onConnect = () => {
			client.publish({
				destination: '/app/subscribe/prevRate',
				body: JSON.stringify({ ticker }),
			});

			client.subscribe(`/topic/prevRate/${ticker}`, (message) => {
				const parsedData = JSON.parse(message.body);
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
}
