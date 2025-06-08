import * as cookie from 'cookie';
import { type LoaderFunctionArgs, redirect, useNavigate } from 'react-router';
import type { Route } from './+types/callback';

import { useEffect } from 'react';
import type { UserInfoResponse } from '~/entities/user/types/user.type';
import ApiClient from '~/shared/api/httpClient';
import { useUserId } from '../provider/UserInfoProvider';

export async function loader({ request }: LoaderFunctionArgs) {
	const rawCookie = request.headers.get('Cookie');
	const cookies = cookie.parse(rawCookie || '');
	const isAccessTokenExists = !!cookies.access_token;

	if (!isAccessTokenExists) {
		return redirect('/trade/BTC/login');
	}

	const response = await ApiClient.get<UserInfoResponse>('api/userinfo', {
		headers: {
			Cookie: rawCookie || '',
		},
	});

	const { data } = await response.json();

	return data.userId;
}

export default function CallbackRoutes({ loaderData }: Route.ComponentProps) {
	const navigate = useNavigate();
	const { userId, setUserId } = useUserId();
	setUserId(loaderData);

	useEffect(() => {
		if (!userId) return;
		navigate('/trade/BTC');
	}, [userId, navigate]);

	return null;
}
