import { Client } from '@stomp/stompjs';

const client = new Client({
	brokerURL: `${import.meta.env.VITE_STOMP_URL}/coin/realtime`,
	heartbeatOutgoing: 4000,
});

export default client;
