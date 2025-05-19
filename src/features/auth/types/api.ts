import type { Response } from '~/shared/types/api';

type TokenCheckResponseData = {
	message: string;
	userId: number;
};

export type TokenCheckResponse = Response<TokenCheckResponseData>;
