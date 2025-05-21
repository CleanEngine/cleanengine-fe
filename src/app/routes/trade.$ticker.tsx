import * as cookie from 'cookie';
import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/trade.$ticker';

import { api as coinApi } from '~/entities/coin';
import CoinPriceWithName from '~/entities/coin/ui/CoinPriceWithName';
import { api } from '~/entities/session';
import { CoinListWithSearchBar } from '~/features/coin-search-list';
import { OrderForm, OrderFormFallback } from '~/features/order';
import { ExecutionList } from '~/features/order-execution-list';
import { Orderbook, StockChart } from '~/features/tradeview';
import Container from '~/shared/ui/Container';
import ContainerTitle from '~/shared/ui/ContainerTitle';
import { NavBar } from '~/widgets/navbar';

export async function loader({ request, params }: Route.LoaderArgs) {
	const rawCookie = request.headers.get('Cookie');
	const cookies = cookie.parse(rawCookie || '');
	const isAccessTokenExists = !!cookies.access_token;

	const response = await coinApi.getCoinList();
	const { data } = await response.json();

	const ticker = params.ticker.toUpperCase();
	const coinInfo = data.assets.find((coin) => coin.ticker === ticker);

	return { isLoggedIn: isAccessTokenExists, coinList: data.assets, coinInfo };
}

export async function clientAction() {
	try {
		await api.logout();
	} catch (error) {
		console.error(error);
	}
	return redirect('/trade/BTC');
}

export default function TradeRouteComponent({
	loaderData,
}: Route.ComponentProps) {
	const coinInfo = loaderData.coinInfo;
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
			{coinInfo && (
				<CoinPriceWithName name={coinInfo?.name} ticker={coinInfo?.ticker} />
			)}
			<div className="grid h-[calc(100dvh-116px)] grid-cols-4 grid-rows-2 gap-4 p-4">
				<div className="col-span-2 col-start-2 row-start-2">
					<Container>
						<ContainerTitle>실시간 체결 목록</ContainerTitle>
						{coinInfo && <ExecutionList ticker={coinInfo.ticker} />}
					</Container>
				</div>
				<div className="col-start-4 row-span-1 row-start-1">
					<Container>
						<ContainerTitle>주문 하기</ContainerTitle>
						{isLoggedIn && coinInfo ? (
							<OrderForm ticker={coinInfo.ticker} />
						) : (
							<OrderFormFallback />
						)}
					</Container>
				</div>
				<div className="col-start-4 row-span-full row-start-2">
					<Container>
						<ContainerTitle>실시간 호가</ContainerTitle>
						{coinInfo && <Orderbook ticker={coinInfo.ticker} />}
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
						{coinInfo && (
							<StockChart key={coinInfo.ticker} ticker={coinInfo.ticker} />
						)}
					</Container>
				</div>
			</div>
			<Outlet />
		</div>
	);
}
