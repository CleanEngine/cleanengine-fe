import { isRouteErrorResponse } from 'react-router';
import { api as userApi } from '~/entities/user';
import { api as profileApi } from '~/features/profile';
import ErrorComponent from '~/shared/ui/Error';
import { ProfileModal } from '~/widgets/user';
import type { Route } from './+types/profile';

const FETCH_SIZE = 10;

export async function loader({ request }: Route.LoaderArgs) {
	const { searchParams } = new URL(request.url);
	const page = Number(searchParams.get('p') || 1);
	const settled = searchParams.get('t') === 'settled';

	const [userInfoResponse, historyResponse] = await Promise.all([
		userApi.getUserInfo(),
		profileApi.getHistory(page, FETCH_SIZE, settled),
	]);

	const [userInfo, history] = await Promise.all([
		userInfoResponse.json(),
		historyResponse.json(),
	]);

	return { userInfo: userInfo.data, historyData: history.data };
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

export default function ProfileRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <ProfileModal userInfo={loaderData.userInfo} />;
}
