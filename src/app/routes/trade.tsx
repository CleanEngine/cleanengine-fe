import * as cookie from 'cookie';
import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/trade';

import { api as coinApi } from '~/entities/coin';
import { api } from '~/entities/session';
import { CoinListWithSearchBar } from '~/features/coin-search-list';
import { OrderForm, OrderFormFallback } from '~/features/order';
import { ExecutionList } from '~/features/order-execution-list';
import { Orderbook, StockChart } from '~/features/tradeview';
import Container from '~/shared/ui/Container';
import ContainerTitle from '~/shared/ui/ContainerTitle';
import { NavBar } from '~/widgets/navbar';

export async function loader({ request }: Route.LoaderArgs) {
	const rawCookie = request.headers.get('Cookie');
	const cookies = cookie.parse(rawCookie || '');
	const isAccessTokenExists = !!cookies.access_token;

	const response = await coinApi.getCoinList();
	const { data } = await response.json();

	return { isLoggedIn: isAccessTokenExists, coinList: data.assets };
}

export async function clientAction() {
	try {
		await api.logout();
	} catch (error) {
		console.error(error);
	}
	return redirect('/trade');
}

export default function TradeRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	const isLoggedIn = loaderData.isLoggedIn;
	const coinList = loaderData.coinList;
	const coinListWithIcon = coinList.map((coinInfo) => ({
		...coinInfo,
		coinIcon: <span>🪙</span>,
		to: `/trade/${coinInfo.ticker}`,
	}));

	return (
		<div className="h-full bg-gray-100">
			<NavBar to="/" serviceName="IF" isBlack isLoggedIn={isLoggedIn} />
			<div className="grid h-[calc(100dvh-60px)] grid-cols-4 grid-rows-2 gap-4 p-4">
				<div className="col-span-2 col-start-2 row-start-2">
					<Container>
						<ContainerTitle>실시간 체결 목록</ContainerTitle>
						<ExecutionList />
					</Container>
				</div>
				<div className="col-start-4 row-span-1 row-start-1">
					<Container>
						<ContainerTitle>주문 하기</ContainerTitle>
						{isLoggedIn ? <OrderForm ticker="TRUMP" /> : <OrderFormFallback />}
					</Container>
				</div>
				<div className="col-start-4 row-span-full row-start-2">
					<Container>
						<ContainerTitle>실시간 호가</ContainerTitle>
						<Orderbook />
					</Container>
				</div>
				<div className="col-start-1 row-span-2 row-start-1">
					<Container>
						<ContainerTitle>가상화폐 리스트</ContainerTitle>
						<CoinListWithSearchBar coinList={coinListWithIcon} />
					</Container>
				</div>
				<div className="col-span-2 col-start-2 row-start-1">
					<Container>
						<ContainerTitle>실시긴 차트</ContainerTitle>
						<StockChart />
					</Container>
				</div>
			</div>
			<Outlet />
		</div>
	);
}
