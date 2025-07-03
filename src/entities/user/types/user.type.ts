import type { Response } from '~/shared/types/api';

export type Wallet = {
	name: string;
	ticker: string;
	accountId: number;
	buyPrice: number;
	currentPrice: number;
	roi: number;
	size: number;
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
