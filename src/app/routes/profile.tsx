import { api as userApi } from '~/entities/user';
import { api as profileApi } from '~/features/profile';
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

export default function ProfileRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <ProfileModal userInfo={loaderData.userInfo} />;
}
