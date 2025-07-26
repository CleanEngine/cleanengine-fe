import { data, isRouteErrorResponse, redirect } from 'react-router';

import ErrorComponent from '~/shared/ui/Error';
import { getCustomReferer } from '~/shared/utils';
import { checkLogin } from '~/shared/utils/util.server';
import { LoginModal } from '~/widgets/auth';
import { commitSession, getSession } from '../sessions.server';
import type { Route } from './+types/login';

export async function loader({ request }: Route.LoaderArgs) {
	const cookie = request.headers.get('Cookie');
	const isLoggedIn = checkLogin(cookie);
	const referer = getCustomReferer(request.url) || '/';

	if (isLoggedIn) {
		return redirect(referer);
	}

	const session = await getSession(cookie);

	session.set('referer', referer);

	return data(
		{ referer },
		{
			headers: {
				'set-cookie': await commitSession(session),
			},
		},
	);
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

export default function LoginRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	const { referer } = loaderData;

	return <LoginModal key="login-modal" referer={referer} />;
}
