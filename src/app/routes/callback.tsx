import * as cookie from 'cookie';
import { type LoaderFunctionArgs, redirect, useNavigate } from 'react-router';
import type { Route } from './+types/callback';

import { useEffect } from 'react';
import type { UserInfoResponse } from '~/entities/user/types/user.type';
import ApiClient from '~/shared/api/httpClient';
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

	const response = await ApiClient.get<UserInfoResponse>('api/userinfo', {
		headers: {
			Cookie: rawCookie,
		},
	});

	const { data } = await response.json();

	return { userId: data.userId, referer: referer };
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
