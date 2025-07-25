import * as cookie from 'cookie';
import { useEffect } from 'react';
import {
	type LoaderFunctionArgs,
	isRouteErrorResponse,
	redirect,
	useNavigate,
} from 'react-router';
import type { Route } from './+types/callback';

import type { UserInfoResponse } from '~/entities/user/types/user.type';
import ApiClient from '~/shared/api/httpClient';
import ErrorComponent from '~/shared/ui/Error';
import { useUserId } from '../provider/UserInfoProvider';
import { getSession } from '../sessions.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const rawCookie = request.headers.get('Cookie') ?? '';

	const session = await getSession(rawCookie);
	const referer = session.get('referer') || '/';

	const cookies = cookie.parse(rawCookie);
	const isAccessTokenExists = !!cookies.access_token;

	if (!isAccessTokenExists) {
		return redirect(referer);
	}

	try {
		const response = await ApiClient.get<UserInfoResponse>('api/userinfo', {
			headers: {
				Cookie: rawCookie,
			},
		});

		const responseData = await response.json();

		return { userId: responseData.data.userId, referer: referer };
	} catch (error) {
		throw new Error('로그인에 실패했습니다. 관리자에게 문의하세요.');
	}
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error)) {
		const errorTitle = `${error.status} ${error.statusText}`;
		const errorDescription = error.data;
		return <ErrorComponent title={errorTitle} description={errorDescription} />;
	}
	if (error instanceof Error) {
		const errorTitle = error.name;
		const errorDescription = error.message;
		return <ErrorComponent title={errorTitle} description={errorDescription} />;
	}

	return (
		<ErrorComponent
			title="Error"
			description="예상하지 못한 에러가 발생했습니다."
		/>
	);
}

export default function CallbackRoutes({ loaderData }: Route.ComponentProps) {
	const { userId, referer } = loaderData;
	const navigate = useNavigate();
	const { setUserId } = useUserId();
	setUserId(userId);

	useEffect(() => {
		if (!userId) return;
		navigate(referer);
	}, [userId, referer, navigate]);

	return null;
}
