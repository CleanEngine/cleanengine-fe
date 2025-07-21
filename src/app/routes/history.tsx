import { isRouteErrorResponse } from 'react-router';
import { TradingHistory } from '~/features/profile';
import { api as profileApi } from '~/features/profile';
import ErrorComponent from '~/shared/ui/Error';
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
