import ky, { type KyResponse } from 'ky';
import type { Message } from '../types/chat.type';

export default {
	ask: async (question: Message): Promise<KyResponse<string>> => {
		return ky.get(
			`${import.meta.env.VITE_AI_URL}/async/chat?question=${question}`,
			{
				credentials: 'omit',
			},
		);
	},
};
