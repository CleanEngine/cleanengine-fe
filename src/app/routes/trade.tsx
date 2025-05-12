import { Outlet } from 'react-router';

import {
	type CoinListItemProps,
	CoinListWithSearchBar,
} from '~/features/coin-search-list/ui';
import { OrderForm } from '~/features/order';
import { ExecutionList, type Order } from '~/features/order-execution-list';
import Container from '~/shared/ui/Container';
import ContainerTitle from '~/shared/ui/ContainerTitle';
import { Orderbook, StockChart } from '~/widgets/chart';
import { NavBar } from '~/widgets/navbar';

const MOCK_ORDER: Order[] = [
	{
		executionPrice: 10000,
		executionVolume: 10,
		fluctuationRate: 0.1,
		transactionAmount: 100,
		time: '10:27:04',
	},
	{
		executionPrice: 10020,
		executionVolume: 7,
		fluctuationRate: -0.05,
		transactionAmount: 70,
		time: '10:26:04',
	},
	{
		executionPrice: 9980,
		executionVolume: 15,
		fluctuationRate: 0.03,
		transactionAmount: 150,
		time: '10:25:04',
	},
	{
		executionPrice: 10050,
		executionVolume: 5,
		fluctuationRate: 0.08,
		transactionAmount: 50,
		time: '10:24:04',
	},
	{
		executionPrice: 9970,
		executionVolume: 12,
		fluctuationRate: -0.12,
		transactionAmount: 120,
		time: '10:23:04',
	},
	{
		executionPrice: 10010,
		executionVolume: 8,
		fluctuationRate: 0.06,
		transactionAmount: 80,
		time: '10:22:04',
	},
	{
		executionPrice: 10030,
		executionVolume: 9,
		fluctuationRate: -0.02,
		transactionAmount: 90,
		time: '10:21:04',
	},
	{
		executionPrice: 10012,
		executionVolume: 11,
		fluctuationRate: 0.04,
		transactionAmount: 110,
		time: '10:20:04',
	},
	{
		executionPrice: 9995,
		executionVolume: 6,
		fluctuationRate: -0.09,
		transactionAmount: 60,
		time: '10:19:04',
	},
	{
		executionPrice: 10025,
		executionVolume: 13,
		fluctuationRate: 0.07,
		transactionAmount: 130,
		time: '10:18:04',
	},
	{
		executionPrice: 10005,
		executionVolume: 14,
		fluctuationRate: -0.03,
		transactionAmount: 140,
		time: '10:17:04',
	},
	{
		executionPrice: 10040,
		executionVolume: 8,
		fluctuationRate: 0.09,
		transactionAmount: 80,
		time: '10:16:04',
	},
	{
		executionPrice: 9988,
		executionVolume: 10,
		fluctuationRate: -0.07,
		transactionAmount: 100,
		time: '10:15:04',
	},
	{
		executionPrice: 10018,
		executionVolume: 7,
		fluctuationRate: 0.02,
		transactionAmount: 70,
		time: '10:14:04',
	},
	{
		executionPrice: 10035,
		executionVolume: 12,
		fluctuationRate: 0.05,
		transactionAmount: 120,
		time: '10:13:04',
	},
	{
		executionPrice: 10008,
		executionVolume: 5,
		fluctuationRate: -0.11,
		transactionAmount: 50,
		time: '10:12:04',
	},
	{
		executionPrice: 10028,
		executionVolume: 9,
		fluctuationRate: 0.01,
		transactionAmount: 90,
		time: '10:11:04',
	},
	{
		executionPrice: 9990,
		executionVolume: 8,
		fluctuationRate: -0.06,
		transactionAmount: 80,
		time: '10:10:04',
	},
];

const MOCK_COIN_LIST: CoinListItemProps[] = [
	{
		to: '/trade/BTC',
		price: 71234000,
		fluctuationRate: 1.2,
		transactionAmount: 1530,
		coinName: '비트코인',
		coinTicker: 'BTC',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/ETH',
		price: 3894000,
		fluctuationRate: -0.7,
		transactionAmount: 840,
		coinName: '이더리움',
		coinTicker: 'ETH',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/XRP',
		price: 820,
		fluctuationRate: 3.5,
		transactionAmount: 12000,
		coinName: '리플',
		coinTicker: 'XRP',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/SOL',
		price: 184000,
		fluctuationRate: 2.1,
		transactionAmount: 530,
		coinName: '솔라나',
		coinTicker: 'SOL',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/ADA',
		price: 780,
		fluctuationRate: -1.3,
		transactionAmount: 23000,
		coinName: '에이다',
		coinTicker: 'ADA',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/DOGE',
		price: 120,
		fluctuationRate: 0.2,
		transactionAmount: 180000,
		coinName: '도지코인',
		coinTicker: 'DOGE',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/MATIC',
		price: 1600,
		fluctuationRate: 1.0,
		transactionAmount: 9000,
		coinName: '폴리곤',
		coinTicker: 'MATIC',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/AAVE',
		price: 112000,
		fluctuationRate: -2.4,
		transactionAmount: 120,
		coinName: '에이브',
		coinTicker: 'AAVE',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/LINK',
		price: 16800,
		fluctuationRate: 0.5,
		transactionAmount: 3100,
		coinName: '체인링크',
		coinTicker: 'LINK',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/STX',
		price: 3200,
		fluctuationRate: 4.0,
		transactionAmount: 4200,
		coinName: '스택스',
		coinTicker: 'STX',
		CoinIcon: <span>🪙</span>,
	},
	// 추가된 MOCK 코인들
	{
		to: '/trade/BNB',
		price: 520000,
		fluctuationRate: 2.7,
		transactionAmount: 720,
		coinName: '바이낸스코인',
		coinTicker: 'BNB',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/AVAX',
		price: 41000,
		fluctuationRate: -1.1,
		transactionAmount: 3700,
		coinName: '아발란체',
		coinTicker: 'AVAX',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/SAND',
		price: 950,
		fluctuationRate: 0.8,
		transactionAmount: 22000,
		coinName: '샌드박스',
		coinTicker: 'SAND',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/AXS',
		price: 11000,
		fluctuationRate: -0.4,
		transactionAmount: 2900,
		coinName: '엑시인피니티',
		coinTicker: 'AXS',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/NEAR',
		price: 6800,
		fluctuationRate: 1.9,
		transactionAmount: 4900,
		coinName: '니어',
		coinTicker: 'NEAR',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/ATOM',
		price: 13600,
		fluctuationRate: -2.2,
		transactionAmount: 1700,
		coinName: '코스모스',
		coinTicker: 'ATOM',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/UNI',
		price: 9200,
		fluctuationRate: 0.3,
		transactionAmount: 2100,
		coinName: '유니스왑',
		coinTicker: 'UNI',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/CAKE',
		price: 3500,
		fluctuationRate: 1.5,
		transactionAmount: 3200,
		coinName: '팬케이크스왑',
		coinTicker: 'CAKE',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/APE',
		price: 2800,
		fluctuationRate: -3.0,
		transactionAmount: 2500,
		coinName: '에이프코인',
		coinTicker: 'APE',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/ALGO',
		price: 720,
		fluctuationRate: 0.6,
		transactionAmount: 15000,
		coinName: '알고랜드',
		coinTicker: 'ALGO',
		CoinIcon: <span>🪙</span>,
	},
	{
		to: '/trade/XTZ',
		price: 2300,
		fluctuationRate: 2.2,
		transactionAmount: 4100,
		coinName: '마지막',
		coinTicker: 'XTZ',
		CoinIcon: <span>🪙</span>,
	},
];

export default function TradeRouteComponent() {
	return (
		<div className="h-full bg-gray-100">
			<NavBar to="/" serviceName="IF" isBlack />
			<div className="grid h-[calc(100dvh-60px)] grid-cols-4 grid-rows-2 gap-4 p-4">
				<div className="col-span-2 col-start-2 row-start-2">
					<Container>
						<ContainerTitle>실시간 체결 목록</ContainerTitle>
						<ExecutionList orders={MOCK_ORDER} />
					</Container>
				</div>
				<div className="col-start-4 row-span-1 row-start-1">
					<Container>
						<ContainerTitle>주문 하기</ContainerTitle>
						<OrderForm />
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
						<CoinListWithSearchBar coinList={MOCK_COIN_LIST} />
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
