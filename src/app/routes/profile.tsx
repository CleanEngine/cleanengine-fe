import { api as userApi } from '~/entities/user';
import { type HistoryResponse, api as profileApi } from '~/features/profile';
import { ProfileModal } from '~/widgets/user';
import type { Route } from './+types/profile';

export async function loader() {
	const response = await userApi.getUserInfo();
	const { data } = await response.json();

	const history = new Promise<HistoryResponse>((res) => {
		profileApi.getHistory().then((response) => {
			response.json().then((data) => {
				res(data);
			});
		});
	});

	return { userInfo: data, historyDataPromise: history };
}

export default function ProfileRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <ProfileModal userInfo={loaderData.userInfo} />;
}
