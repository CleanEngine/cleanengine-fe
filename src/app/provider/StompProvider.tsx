import { Client } from '@stomp/stompjs';
import { createContext, useContext, useEffect, useState } from 'react';

type StompProviderProps = {
	children: React.ReactNode;
	brokerURL: string;
};

type StompContextType = {
	client: Client | null;
	connected: boolean;
};

export const StompContext = createContext<StompContextType | null>(null);

export default function StompProvider({
	children,
	brokerURL,
}: StompProviderProps) {
	const [stompClient, setStompClient] = useState<Client | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const client = new Client({
			brokerURL,
		});

		client.onConnect = () => {
			setIsConnected(true);
		};

		client.onDisconnect = () => {
			setIsConnected(false);
		};

		client.onWebSocketError = (error) => {
			console.error('onWebSocketError');
			console.error(`error:${error}`);
			if (error instanceof Error) {
				console.error(error.message);
			}
			setIsConnected(false);
		};

		client.onStompError = (frame) => {
			console.error('onStompError');
			console.error(`Broker reported error: ${frame.headers.message}`);
			console.error(`Additional details: ${frame.body}`);
		};

		client.activate();
		setStompClient(client);

		return () => {
			client.deactivate();
		};
	}, [brokerURL]);

	return (
		<StompContext.Provider
			value={{ client: stompClient, connected: isConnected }}
		>
			{children}
		</StompContext.Provider>
	);
}

export function useStompClient() {
	const stompContext = useContext(StompContext);

	if (!stompContext) {
		throw new Error(
			'useStompClient hook은 StompProvider 내부에서 사용해야 합니다.',
		);
	}

	return { client: stompContext.client, connected: stompContext.connected };
}
