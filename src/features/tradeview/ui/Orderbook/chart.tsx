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
	const color = type === 'bull' ? 'red' : 'blue';

	return (
		<div
			className={clsx(
				'flex h-full min-h-full w-full px-1',
				type === 'bull' ? 'bg-red-100' : 'bg-blue-100',
			)}
		>
			<div className="flex h-full min-h-full flex-col justify-around">
				{data.map((item) => (
					<div key={item.price + item.size} style={{ overflowAnchor: 'none' }}>
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
