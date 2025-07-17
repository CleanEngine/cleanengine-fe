import { data } from 'react-router';
import { LoginModal } from '~/widgets/auth';
import { commitSession, getSession } from '../sessions.server';
import type { Route } from './+types/login';

export async function loader({ request }: Route.LoaderArgs) {
	const { searchParams } = new URL(request.url);
	const session = await getSession(request.headers.get('Cookie'));

	const referer = searchParams.get('referer') || '/';
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

export default function LoginRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	const { referer } = loaderData;

	return <LoginModal key="login-modal" referer={referer} />;
}
