import type { Order } from '../../type/order';
import OrderItem from '../OrderItem';

interface OrderBookProps {
	orders: Order[];
}

export default function OrderBook({ orders }: OrderBookProps) {
	const orderList = orders?.length ? (
		orders.map((order, index) => (
			<OrderItem
				key={order.executionPrice}
				isGray={index % 2 === 0}
				{...order}
			/>
		))
	) : (
		<span className="text-gray-400 text-sm">데이터가 없습니다.</span>
	);

	return (
		<div className="flex min-h-0 min-w-2xl flex-1 flex-col text-sm">
			<div className="flex p-2 font-normal">
				<div className="flex-2 text-left text-gray-900">
					<span>체결가</span>
				</div>
				<div className="flex-1 text-right text-gray-900">
					<span>체결량</span>
				</div>
				<div className="flex-1 text-right text-gray-900">
					<span>등락률</span>
				</div>
				<div className="flex-1 text-right text-gray-900">
					<span>거래량</span>
				</div>
				<div className="flex-1 text-right text-gray-900">
					<span>시간</span>
				</div>
			</div>
			<div className="scrollbar-custom min-h-0 flex-1 overflow-y-scroll pr-0.5">
				{orderList}
			</div>
		</div>
	);
}
