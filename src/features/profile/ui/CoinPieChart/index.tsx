import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { COLORS } from '../../const/chart.const';
import type { CoinPieChartData } from '../../types/chart.type';
import CoinPieChartActiveShape from '../CoinPieChartActiveShape';

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
					labelLine={false}
					innerRadius={60}
					outerRadius={80}
					activeShape={CoinPieChartActiveShape}
				>
					{coinData.map((item, index) => (
						<Cell
							key={item.ticker}
							fill={COLORS[index % COLORS.length].backgroundColor}
						/>
					))}
				</Pie>
			</PieChart>
		</ResponsiveContainer>
	);
}
