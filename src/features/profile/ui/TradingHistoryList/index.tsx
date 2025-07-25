import { useSearchParams } from 'react-router';

import useScrollTo from '~/shared/hooks/useScrollTo';
import Pagination from '~/shared/ui/Pagination';
import Tab from '~/shared/ui/Tab';
import type { HistoryResonseData } from '../../types/tradingHistory.type';
import TradingHistoryListItem from '../TradingHistoryListItem';

type TradingHistoryListProps = {
	historyData: HistoryResonseData;
};

export default function TradingHistoryList({
	historyData,
}: TradingHistoryListProps) {
	const scrollContainerRef = useScrollTo<HTMLUListElement>([], {
		top: 0,
		behavior: 'instant',
	});

	const [searchParams, setSearchParams] = useSearchParams({
		p: '1',
		t: 'unsettled',
	});
	const currentPage = Number(searchParams.get('p'));
	const tab = searchParams.get('t') || 'unsettled';

	const handleTabClick = (value: string) => {
		setSearchParams({ p: '1', t: value });
	};

	const handleClickPageNumber = (page: number) => {
		setSearchParams({ p: page.toString(), t: tab });
	};

	const handlePrevClick = () => {
		setSearchParams({
			p: (currentPage - 1).toString(),
			t: tab,
		});
	};

	const handleNextClick = () => {
		setSearchParams({
			p: (currentPage + 1).toString(),
			t: tab,
		});
	};

	return (
		<div className="w-full border-1 border-gray-200">
			<Tab
				items={[
					{ label: '미체결 내역', value: 'unsettled' },
					{ label: '체결 내역', value: 'settled' },
				]}
				selected={tab}
				onClick={handleTabClick}
			/>
			<div className="flex border-gray-200 border-b-1 px-2 py-1">
				<span className="flex-1">매매종류</span>
				<span className="flex-1">종목</span>
				<span className="flex-1">가격</span>
				<span className="flex-1">수량</span>
				<span className="flex-[2.5]">거래시간</span>
				<span className="flex-1 text-center">
					{tab === 'unsettled' ? '주문 취소' : '상태'}
				</span>
			</div>
			<ul
				className="scrollbar-custom flex h-60 flex-col gap-2 overflow-auto px-2 py-2"
				ref={scrollContainerRef}
			>
				{historyData.orderList.map((item) => (
					<TradingHistoryListItem key={item.orderId} {...item} />
				))}
			</ul>
			<Pagination
				currentPage={currentPage}
				totalPages={historyData.totalPages}
				showCount={10}
				onClick={handleClickPageNumber}
				onPrevClick={handlePrevClick}
				onNextClick={handleNextClick}
			/>
		</div>
	);
}
