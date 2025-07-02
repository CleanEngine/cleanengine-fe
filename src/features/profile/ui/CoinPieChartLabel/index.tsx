import type { PieLabelProps } from 'recharts/types/polar/Pie';
import { COLORS, LABEL_POSTION_WEIGHT, RADIAN } from '../../const/chart.const';

export default function CoinPieChartLabel({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
	name,
}: PieLabelProps) {
	const radius =
		innerRadius + (outerRadius - innerRadius) * LABEL_POSTION_WEIGHT;
	const x = midAngle ? cx + radius * Math.cos(-midAngle * RADIAN) : cx;
	const y = midAngle ? cy + radius * Math.sin(-midAngle * RADIAN) : cy;
	const color = index ? COLORS[index % COLORS.length].textColor : '#fff';

	return (
		<text
			x={x}
			y={y}
			fill={color}
			textAnchor="middle"
			dominantBaseline="central"
		>
			{percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
		</text>
	);
}
