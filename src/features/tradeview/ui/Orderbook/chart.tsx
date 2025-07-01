import clsx from 'clsx';
import {
	Bar,
	BarChart,
	LabelList,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts';
import { formatCurrencyKR } from '~/shared/utils';
import type { OrderBookChartData } from '../../types/orderbook.type';

export type OrderbookChartProps = {
	data: OrderBookChartData[];
	type?: 'bull' | 'bear';
	layout?: 'vertical' | 'horizontal';
};

export default function OrderbookChart({
	data,
	type = 'bull',
	layout = 'vertical',
}: Readonly<OrderbookChartProps>) {
	const color = type === 'bull' ? '#FDD2D7' : '#CDE0FE';

	return (
		<div
			className={clsx(
				'flex h-full min-h-full w-full px-1',
				type === 'bull' ? 'bg-red-50' : 'bg-blue-50',
			)}
		>
			<div className="flex h-full min-h-full flex-col justify-around">
				{data.map((item) => (
					<div
						key={item.price + item.size}
						className="text-[#4287F9]"
						style={{ overflowAnchor: 'none' }}
					>
						{formatCurrencyKR(item.price)}
					</div>
				))}
			</div>
			<div className="h-full min-h-full w-full">
				<ResponsiveContainer width="100%">
					<BarChart layout={layout} data={data} barGap={0} barCategoryGap={0}>
						<XAxis type="number" dataKey="size" hide={true} />
						<YAxis type="category" dataKey="price" hide={true} />
						<Bar dataKey="size" fill={color} barSize="100%">
							<LabelList dataKey="size" position="insideLeft" />
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
