import * as cookie from 'cookie';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Outlet, redirect } from 'react-router';

import { CoinPriceWithName, api as coinApi } from '~/entities/coin';
import { api } from '~/entities/session';
import { AIChatBot } from '~/features/chat';
import { CoinListWithSearchBar } from '~/features/coin-search-list';
import { OrderForm, OrderFormFallback } from '~/features/order';
import { ExecutionList } from '~/features/order-execution-list';
import useTradeNotification from '~/features/trade/hooks/useTradeNotification';
import { Orderbook, StockChart } from '~/features/tradeview';
import Container from '~/shared/ui/Container';
import ContainerTitle from '~/shared/ui/ContainerTitle';
import { NavBar, SideBar } from '~/widgets/navbar';
import { useUserId } from '../provider/UserInfoProvider';
import type { Route } from './+types/trade.$ticker';

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
	const { userId } = useUserId();
	useTradeNotification(userId || 0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { coinInfo, coinList, isLoggedIn } = loaderData;
	const coinListWithIcon = coinList.map((coinInfo) => ({
		...coinInfo,
		coinIcon: <span>🪙</span>,
		to: `/trade/${coinInfo.ticker}`,
	}));

	const handleOpenMenu = () => {
		setIsMenuOpen(true);
	};

	const handleCloseMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<div className="relative min-h-screen bg-gray-100">
			<NavBar
				to="/"
				serviceName="IF"
				isBlack
				isLoggedIn={isLoggedIn}
				ticker={coinInfo?.ticker}
				onClickMenuButton={handleOpenMenu}
			/>
			{coinInfo && (
				<CoinPriceWithName name={coinInfo?.name} ticker={coinInfo?.ticker} />
			)}
			<div className="relative flex h-[calc(100dvh-116px)] flex-col gap-4 overflow-x-scroll p-4 md:grid md:grid-cols-2 md:grid-rows-5 xl:grid-cols-3 xl:grid-rows-2 2xl:grid-cols-4 2xl:grid-rows-2">
				<div className="h-auto md:col-span-full md:row-span-2 md:row-start-1 xl:col-span-full xl:row-span-1 xl:row-start-1 2xl:col-span-2 2xl:col-start-2 2xl:row-start-1">
					<Container>
						<ContainerTitle>실시간 차트</ContainerTitle>
						{coinInfo && (
							<StockChart
								key={`chart-${coinInfo.ticker}`}
								ticker={coinInfo.ticker}
							/>
						)}
					</Container>
				</div>
				<div className="md:col-span-1 md:col-start-2 md:row-span-2 md:row-start-3 xl:col-span-1 xl:col-start-3 xl:row-span-1 xl:row-start2 2xl:col-start-4 2xl:row-span-1 2xl:row-start-1">
					<Container>
						<ContainerTitle>주문 하기</ContainerTitle>
						{isLoggedIn && coinInfo ? (
							<OrderForm ticker={coinInfo.ticker} />
						) : (
							<OrderFormFallback ticker={coinInfo?.ticker || 'BTC'} />
						)}
					</Container>
				</div>
				<div className="md:col-span-1 md:col-start-1 md:row-span-2 md:row-start-3 xl:col-span-1 xl:col-start-2 xl:row-span-1 xl:row-start-2 2xl:col-start-4 2xl:row-span-full 2xl:row-start-2">
					<Container>
						<ContainerTitle>실시간 호가</ContainerTitle>
						{coinInfo && <Orderbook ticker={coinInfo.ticker} />}
					</Container>
				</div>
				<div className="md:col-span-full md:row-span-1 md:row-start-5 xl:col-span-1 xl:col-start-1 xl:row-span-1 xl:row-start-2 2xl:col-span-2 2xl:col-start-2 2xl:row-start-2">
					<Container>
						<ContainerTitle>실시간 체결 목록</ContainerTitle>
						{coinInfo && (
							<ExecutionList ticker={coinInfo.ticker} key={coinInfo.ticker} />
						)}
					</Container>
				</div>
				<div className="hidden 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1 2xl:block">
					<Container>
						<ContainerTitle>가상화폐 리스트</ContainerTitle>
						<CoinListWithSearchBar coinList={coinListWithIcon} />
					</Container>
				</div>
			</div>
			<AnimatePresence>
				{isMenuOpen && (
					<SideBar
						coinListWithIcon={coinListWithIcon}
						onClose={handleCloseMenu}
						key="sidebar"
					/>
				)}
				<Outlet />
				<AIChatBot key="ai-chatbot" />
			</AnimatePresence>
		</div>
	);
}
