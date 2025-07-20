import { TradingHistory } from '~/features/profile';
import { api as profileApi } from '~/features/profile';
import type { Route } from './+types/history';

const FETCH_SIZE = 10;

export async function loader({ request }: Route.LoaderArgs) {
	const { searchParams } = new URL(request.url);
	const page = Number(searchParams.get('p') || 1);
	const settled = searchParams.get('t') === 'settled';

	const response = profileApi.getHistory(page, FETCH_SIZE, settled);

	const { data } = await response.json();

	return data;
}

export default function HistoryRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	return <TradingHistory historyData={loaderData} />;
}
