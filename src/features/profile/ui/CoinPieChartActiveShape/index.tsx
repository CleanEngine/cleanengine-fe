import type { SVGProps } from 'react';
import { Sector, type SectorProps } from 'recharts';
import type { CoinPieChartData } from '../../types/chart.type';

type Coordinate = {
	x: number;
	y: number;
};

type PieSectorData = {
	percent?: number;
	name?: string | number;
	midAngle?: number;
	middleRadius?: number;
	tooltipPosition?: Coordinate;
	value?: number;
	paddingAngle?: number;
	dataKey?: string;
	payload?: CoinPieChartData;
};

type CoinPieChartActiveShapeProps = SVGProps<SVGPathElement> &
	Partial<SectorProps> &
	PieSectorData;

export default function CoinPieChartActiveShape({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	startAngle,
	endAngle,
	fill,
	payload,
	percent,
	value,
}: CoinPieChartActiveShapeProps) {
	const RADIAN = Math.PI / 180;
	const sin = Math.sin(-RADIAN * (midAngle ?? 1));
	const cos = Math.cos(-RADIAN * (midAngle ?? 1));
	const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
	const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
	const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
	const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 11;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
				{payload?.ticker}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={(outerRadius ?? 0) + 6}
				outerRadius={(outerRadius ?? 0) + 10}
				fill={fill}
			/>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill="none"
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill="#333"
				fontSize={14}
			>{`${((percent ?? 1) * 100).toFixed(0)}%`}</text>
		</g>
	);
}
