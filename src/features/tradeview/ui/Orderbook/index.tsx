import { useRef } from 'react';

import type { CoinTicker } from '~/entities/coin';
import useOrderBookData from '../../hooks/useOrderBookData';
import useScrollMiddle from '../../hooks/useScrollMiddle';
import OrderbookChart from './chart';

type OrderbookProps = {
	ticker: CoinTicker;
};

export default function Orderbook({ ticker }: OrderbookProps) {
	const data = useOrderBookData(ticker);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	useScrollMiddle(scrollContainerRef, data);

	return (
		<div
			ref={scrollContainerRef}
			className="scrollbar-custom h-full w-full overflow-y-scroll"
		>
			{data && (
				<OrderbookChart data={data.sellOrderBookChartData} type="bear" />
			)}
			{data && <OrderbookChart data={data.buyOrderBookChartData} />}
		</div>
	);
}
