import { HTTPError } from 'ky';
import { data, isRouteErrorResponse, redirect } from 'react-router';

import { api as userApi } from '~/entities/user';
import ErrorModal from '~/shared/ui/ErrorModal';
import { checkLogin } from '~/shared/utils/util.server';
import { ProfileModal } from '~/widgets/user';
import type { Route } from './+types/profile';

export async function loader({ request }: Route.LoaderArgs) {
	const rawCookie = request.headers.get('Cookie');
	const isLoggedIn = checkLogin(rawCookie);

	if (!isLoggedIn) {
		return redirect('/login');
	}

	try {
		const response = await userApi.getUserInfo({
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error)) {
		const errorTitle = `${error.status} ${error.statusText}`;
		const errorDescription = error.data;
		return <ErrorModal title={errorTitle} description={errorDescription} />;
	}
	if (error instanceof Error) {
		const errorTitle = error.name;
		const errorDescription = error.message;
		return <ErrorModal title={errorTitle} description={errorDescription} />;
	}

	return (
		<ErrorModal
			title="Error"
			description="예상하지 못한 에러가 발생했습니다."
		/>
	);
}

export default function ProfileRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <ProfileModal userInfo={loaderData} />;
}
