import type { CoinTicker } from '~/entities/coin';
import useOrderBookData from '../../hooks/useOrderBookData';
import OrderbookChart from './chart';

type OrderbookProps = {
	ticker: CoinTicker;
};

export default function Orderbook({ ticker }: OrderbookProps) {
	const data = useOrderBookData(ticker);

	return (
		<div className="scrollbar-custom h-full w-full overflow-y-scroll">
			{data && <OrderbookChart data={data.sellOrderBookUnits} type="bear" />}
			{data && <OrderbookChart data={data.buyOrderBookUnits} />}
		</div>
	);
}
