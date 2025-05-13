import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useLayoutEffect, useRef } from 'react';

const THEME = {
	bull: {
		barColor: am5.color('#e12343'),
		textColor: am5.color('#fff'),
	},
	bear: {
		barColor: am5.color('#1772f8'),
		textColor: am5.color('#fff'),
	},
};

export type OrderbookChartProps = {
	data: { offerPrice: string; quantity: number }[];
	type?: 'bull' | 'bear';
};

export default function OrderbookChart({
	data,
	type = 'bull',
}: OrderbookChartProps) {
	const xAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer>>(null);
	const yAxisRef = useRef<am5xy.CategoryAxis<am5xy.AxisRenderer>>(null);
	const seriesRef = useRef<am5xy.ColumnSeries>(null);
	const chartRef = useRef<am5xy.XYChart>(null);
	const rootRef = useRef<am5.Root>(null);

	useLayoutEffect(() => {
		yAxisRef.current?.data.setAll(data);

		seriesRef.current?.data.setAll(data);
		seriesRef.current?.appear();

		chartRef.current?.appear();
	}, [data]);

	useLayoutEffect(() => {
		rootRef.current = am5.Root.new(`orderbook-${type}`);

		chartRef.current = rootRef.current.container.children.push(
			am5xy.XYChart.new(rootRef.current, {
				panX: false,
				panY: false,
				wheelX: 'none',
				wheelY: 'none',
				layout: rootRef.current.verticalLayout,
				paddingBottom: 0,
				paddingLeft: 0,
				paddingRight: 0,
				paddingTop: 0,
			}),
		);

		chartRef.current.set(
			'background',
			am5.Rectangle.new(rootRef.current, {
				stroke: am5.color('#fff'),
				strokeOpacity: 0,
				fill: THEME[type].barColor,
				fillOpacity: 0.05,
			}),
		);
		yAxisRef.current = chartRef.current.yAxes.push(
			am5xy.CategoryAxis.new(rootRef.current, {
				categoryField: 'offerPrice',
				renderer: am5xy.AxisRendererY.new(rootRef.current, {
					inversed: type === 'bull',
					cellStartLocation: 0,
					cellEndLocation: 1,
				}),
			}),
		);

		yAxisRef.current?.get('renderer').labels.template.setAll({
			textAlign: 'center',
			centerY: am5.p50,
		});

		xAxisRef.current = chartRef.current.xAxes.push(
			am5xy.ValueAxis.new(rootRef.current, {
				renderer: am5xy.AxisRendererX.new(rootRef.current, {
					strokeOpacity: 0.1,
				}),
				min: 0,
				visible: false,
				strictMinMax: true,
			}),
		);

		seriesRef.current = chartRef.current.series.push(
			am5xy.ColumnSeries.new(rootRef.current, {
				name: '실시간 호가',
				xAxis: xAxisRef.current,
				yAxis: yAxisRef.current,
				valueXField: 'quantity',
				categoryYField: 'offerPrice',
				sequencedInterpolation: true,
				tooltip: am5.Tooltip.new(rootRef.current, {
					pointerOrientation: 'horizontal',
					labelText: '[bold]{categoryY}원 {valueX}개',
				}),
				paddingBottom: 0,
				paddingTop: 0,
			}),
		);

		seriesRef.current.columns.template.setAll({
			height: am5.p100,
			strokeOpacity: 0.1,
			fillOpacity: 0.4,
			fill: THEME[type].barColor,
		});

		seriesRef.current?.bullets.push(() => {
			if (!rootRef.current) return;
			return am5.Bullet.new(rootRef.current, {
				locationX: 0,
				locationY: 0.5,
				sprite: am5.Label.new(rootRef.current, {
					centerY: am5.p50,
					text: '{valueX}',
					populateText: true,
					fill: THEME[type].textColor,
				}),
			});
		});

		const cursor = chartRef.current?.set(
			'cursor',
			am5xy.XYCursor.new(rootRef.current, {}),
		);
		cursor?.lineY.set('forceHidden', true);
		cursor?.lineX.set('forceHidden', true);

		return () => {
			chartRef.current?.dispose();
			rootRef.current?.dispose();
		};
	}, [type]);

	return <div id={`orderbook-${type}`} className="h-full w-full" />;
}
