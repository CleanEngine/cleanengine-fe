import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { COLORS } from '../../const/chart.const';
import type { CoinPieChartData } from '../../types/chart.type';
import CoinPieChartLabel from '../CoinPieChartLabel';
import CoinPieChartTooltip from '../CoinPieChartTooltip';

type CoinPieChartProps = { coinData: CoinPieChartData[] };

export default function CoinPieChart({ coinData }: CoinPieChartProps) {
	return (
		<ResponsiveContainer>
			<PieChart data={coinData}>
				<Pie
					cx="50%"
					cy="50%"
					nameKey="ticker"
					dataKey="totalPrice"
					label={CoinPieChartLabel}
					labelLine={false}
				>
					{coinData.map((item, index) => (
						<Cell
							key={item.ticker}
							fill={COLORS[index % COLORS.length].backgroundColor}
						/>
					))}
				</Pie>
				<Tooltip content={CoinPieChartTooltip} />
			</PieChart>
		</ResponsiveContainer>
	);
}
