import { api } from '~/entities/user';
import { ProfileModal } from '~/widgets/user';
import type { Route } from './+types/profile';

export async function loader() {
	const response = await api.getUserInfo();
	const { data } = await response.json();
	return data;
}

export default function ProfileRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <ProfileModal userInfo={loaderData} />;
}
