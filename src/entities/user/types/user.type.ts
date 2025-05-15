import type { Response } from '~/shared/types/api';

type UserInfoResponseData = {
	userId: number;
	email: string;
	nickname: string;
	provider: string;
	cash: number;
};

export type UserInfoResponse = Response<UserInfoResponseData>;
