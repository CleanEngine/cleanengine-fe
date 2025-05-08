import ContainerTitle from '~/shared/ui/ContainerTitle';
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
		<div className="min-w-3xl p-4">
			<ContainerTitle>실시간 시세</ContainerTitle>
			<div className="mt-1 text-sm">
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
				<div className="scrollbar-custom h-56 overflow-y-scroll pr-0.5">
					{orderList}
				</div>
			</div>
		</div>
	);
}
