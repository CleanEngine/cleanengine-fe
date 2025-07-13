import { useState } from 'react';
import Pagination from '~/shared/ui/Pagination';
import Tab from '~/shared/ui/Tab';
import type { TradingHistory } from '../../types/tradingHistory.type';
import TradingHistoryListItem from '../TradingHistoryListItem';

const HISTORY_LIST: TradingHistory[] = [
	{
		orderId: '1',
		side: 'ask',
		orderType: 'limit',
		ticker: 'BTC',
		size: 1,
		price: 100000,
		status: 'unsettled',
	},
	{
		orderId: '2',
		side: 'bid',
		orderType: 'market',
		ticker: 'ETH',
		price: 2800000,
		status: 'settled',
	},
	{
		orderId: '3',
		side: 'ask',
		orderType: 'market',
		ticker: 'XRP',
		size: 1000,
		status: 'unsettled',
	},
	{
		orderId: '4',
		side: 'bid',
		orderType: 'limit',
		ticker: 'ADA',
		size: 300,
		price: 600,
		status: 'settled',
	},
	{
		orderId: '5',
		side: 'ask',
		orderType: 'limit',
		ticker: 'DOGE',
		size: 5000,
		price: 90,
		status: 'unsettled',
	},
	{
		orderId: '6',
		side: 'bid',
		orderType: 'market',
		ticker: 'SOL',
		price: 65000,
		status: 'settled',
	},
	{
		orderId: '7',
		side: 'ask',
		orderType: 'limit',
		ticker: 'BNB',
		size: 2,
		price: 480000,
		status: 'settled',
	},
	{
		orderId: '8',
		side: 'bid',
		orderType: 'limit',
		ticker: 'BTC',
		size: 0.5,
		price: 98000,
		status: 'unsettled',
	},
	{
		orderId: '9',
		side: 'ask',
		orderType: 'market',
		ticker: 'DOT',
		size: 50,
		status: 'settled',
	},
	{
		orderId: '10',
		side: 'bid',
		orderType: 'limit',
		ticker: 'AVAX',
		size: 15,
		price: 18000,
		status: 'unsettled',
	},
	{
		orderId: '11',
		side: 'ask',
		orderType: 'limit',
		ticker: 'SHIB',
		size: 50000000,
		price: 0.001,
		status: 'unsettled',
	},
	{
		orderId: '12',
		side: 'bid',
		orderType: 'market',
		ticker: 'MATIC',
		price: 600,
		status: 'settled',
	},
	{
		orderId: '13',
		side: 'ask',
		orderType: 'limit',
		ticker: 'LTC',
		size: 8,
		price: 70000,
		status: 'settled',
	},
	{
		orderId: '14',
		side: 'bid',
		orderType: 'limit',
		ticker: 'LINK',
		size: 25,
		price: 12000,
		status: 'unsettled',
	},
	{
		orderId: '15',
		side: 'ask',
		orderType: 'market',
		ticker: 'ATOM',
		size: 20,
		status: 'unsettled',
	},
	{
		orderId: '16',
		side: 'bid',
		orderType: 'limit',
		ticker: 'ETH',
		size: 2,
		price: 2850000,
		status: 'settled',
	},
	{
		orderId: '17',
		side: 'ask',
		orderType: 'limit',
		ticker: 'XLM',
		size: 3000,
		price: 200,
		status: 'unsettled',
	},
	{
		orderId: '18',
		side: 'bid',
		orderType: 'market',
		ticker: 'SAND',
		price: 450,
		status: 'settled',
	},
	{
		orderId: '19',
		side: 'ask',
		orderType: 'market',
		ticker: 'XTZ',
		size: 100,
		status: 'unsettled',
	},
	{
		orderId: '20',
		side: 'bid',
		orderType: 'limit',
		ticker: 'BTC',
		size: 0.2,
		price: 101000,
		status: 'settled',
	},
];

export default function TradingHistoryList() {
	const [selectedTab, setSelectedTab] = useState('unsettled');

	const handleTabClick = (value: string) => {
		setSelectedTab(value);
	};

	return (
		<div className="w-full border-1 border-gray-200">
			<Tab
				items={[
					{ label: '미체결 내역', value: 'unsettled' },
					{ label: '체결 내역', value: 'settled' },
				]}
				selected={selectedTab}
				onClick={handleTabClick}
			/>
			<div className="flex border-gray-200 border-b-1 px-2 py-1">
				<span className="flex-1">매매종류</span>
				<span className="flex-1">종목</span>
				<span className="flex-1">가격</span>
				<span className="flex-1">수량</span>
				<span className="flex-1 text-center">취소</span>
			</div>
			<ul className="scrollbar-custom flex max-h-60 flex-col gap-2 overflow-auto px-2 py-2">
				{HISTORY_LIST.map((item) => (
					<TradingHistoryListItem key={item.orderId} {...item} />
				))}
			</ul>
			<Pagination
				currentPage={11}
				totalPages={40}
				showCount={10}
				onClick={() => {}}
				onPrevClick={() => {}}
				onNextClick={() => {}}
			/>
		</div>
	);
}
