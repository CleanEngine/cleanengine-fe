import { HTTPError } from 'ky';
import { data, isRouteErrorResponse, redirect } from 'react-router';

import { TradingHistory, api as profileApi } from '~/features/profile';
import ErrorComponent from '~/shared/ui/Error';
import { checkLogin } from '~/shared/utils/util.server';
import type { Route } from './+types/history';

const FETCH_SIZE = 10;

export async function loader({ request }: Route.LoaderArgs) {
	const rawCookie = request.headers.get('Cookie');
	const isLoggedIn = checkLogin(rawCookie);

	if (!isLoggedIn) {
		return redirect('/login');
	}

	const { searchParams } = new URL(request.url);
	const page = searchParams.get('p') ? Number(searchParams.get('p')) : 1;
	const settled = searchParams.get('t') === 'settled';

	if (page < 1) {
		throw data('잘못된 요청입니다.', { status: 400 });
	}

	try {
		const response = await profileApi.getHistory(page, FETCH_SIZE, settled, {
			headers: {
				Cookie: rawCookie as string,
			},
		});
		const { data } = await response.json();
		return data;
	} catch (error) {
		if (error instanceof HTTPError) {
			const errorText = await error.response.text();
			throw data(errorText, { status: error.response.status });
		}
		if (error instanceof Error) {
			throw data(error.message, { status: 500 });
		}
		throw data('예상하지 못한 에러가 발생했습니다.', { status: 500 });
	}
}

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const orderId = formData.get('orderId') as string;

	if (!orderId) {
		throw data('주문번호가 존재하지 않습니다.', { status: 400 });
	}

	try {
		await profileApi.deleteHistory(orderId);

		return data({}, { status: 205 });
	} catch (error) {
		if (error instanceof HTTPError) {
			const errorText = await error.response.text();
			throw data(errorText, { status: error.response.status });
		}
		if (error instanceof Error) {
			throw data(error.message, { status: 500 });
		}
		throw data('예상하지 못한 에러가 발생했습니다.', { status: 500 });
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

export default function HistoryRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <TradingHistory historyData={loaderData} />;
}
