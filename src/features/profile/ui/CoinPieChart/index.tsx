import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { COLORS } from '../../const/chart.const';
import type { CoinPieChartData } from '../../types/chart.type';
import CoinPieChartActiveShape from '../CoinPieChartActiveShape';

export type CoinPieChartProps = {
	coinData: CoinPieChartData[];
	onClick?: (data: CoinPieChartData) => void;
};

export default function CoinPieChart({ coinData, onClick }: CoinPieChartProps) {
	const handleClick = ({ payload }: { payload: CoinPieChartData }) => {
		onClick?.(payload);
	};

	return (
		<ResponsiveContainer>
			<PieChart data={coinData}>
				<Pie
					onClick={handleClick}
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
