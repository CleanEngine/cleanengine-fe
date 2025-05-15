import useOrderBookData from '../../hooks/useOrderBookData';
import OrderbookChart from './chart';

export default function Orderbook() {
	const data = useOrderBookData();

	return (
		<div className="h-full w-full overflow-y-scroll">
			{data && <OrderbookChart data={data.sellOrderBookUnits} type="bear" />}
			{data && <OrderbookChart data={data.buyOrderBookUnits} />}
		</div>
	);
}
