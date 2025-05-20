import type { Response } from '~/shared/types/api';

type Wallet = {
	accountId: number;
	buyPrice: string;
	id: number;
	roi: string;
	size: string;
	ticker: string;
};

type UserInfoResponseData = {
	userId: number;
	email: string;
	nickname: string;
	provider: string;
	cash: number;
	wallets: Wallet[];
};

export type UserInfoResponse = Response<UserInfoResponseData>;
