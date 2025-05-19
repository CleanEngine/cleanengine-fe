import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { OrderBookUnit } from '../../types/orderbook.type';

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
	data: OrderBookUnit[];
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

	useEffect(() => {
		if (!chartRef.current || !yAxisRef.current || !seriesRef.current) return;

		const formattedData = data.map((item) => ({
			price: item.price.toString(),
			size: item.size,
			priceY: item.price,
			sizeX: item.size,
		}));

		yAxisRef.current.data.setAll(formattedData);
		seriesRef.current.data.setAll(formattedData);

		chartRef.current.series.each((series) => {
			series.appear(1000);
		});
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
		const yRenderer = am5xy.AxisRendererY.new(rootRef.current, {
			inversed: type === 'bull',
			cellStartLocation: 0,
			cellEndLocation: 1,
		});

		yRenderer.labels.template.setAll({
			textAlign: 'center',
			centerY: am5.p50,
		});

		yAxisRef.current = chartRef.current.yAxes.push(
			am5xy.CategoryAxis.new(rootRef.current, {
				categoryField: 'price',
				renderer: yRenderer,
			}),
		);

		xAxisRef.current = chartRef.current.xAxes.push(
			am5xy.ValueAxis.new(rootRef.current, {
				renderer: am5xy.AxisRendererX.new(rootRef.current, {
					strokeOpacity: 1,
					stroke: am5.color('#cccccc'),
					strokeWidth: 1,
				}),
				min: 0,
				visible: false,
				strictMinMax: true,
				max: undefined,
				autoZoom: true,
			}),
		);

		seriesRef.current = chartRef.current.series.push(
			am5xy.ColumnSeries.new(rootRef.current, {
				name: '실시간 호가',
				xAxis: xAxisRef.current,
				yAxis: yAxisRef.current,
				valueXField: 'size',
				categoryYField: 'price',
				sequencedInterpolation: true,
				tooltip: am5.Tooltip.new(rootRef.current, {
					pointerOrientation: 'horizontal',
					labelText: '[bold]{priceY}원 {sizeX}개',
				}),
				paddingBottom: 0,
				paddingTop: 0,
				visible: true,
			}),
		);

		seriesRef.current.columns.template.setAll({
			height: am5.p100,
			strokeOpacity: 1,
			stroke: THEME[type].barColor,
			strokeWidth: 0.5,
			fillOpacity: 0.8,
			fill: THEME[type].barColor,
			width: am5.p100,
		});

		seriesRef.current?.bullets.push(() => {
			if (!rootRef.current) return;
			return am5.Bullet.new(rootRef.current, {
				locationX: 0,
				locationY: 0.5,
				sprite: am5.Label.new(rootRef.current, {
					centerY: am5.p50,
					text: '{sizeX}',
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

	return (
		<div
			id={`orderbook-${type}`}
			className="h-full w-full"
			style={{ minHeight: '200px' }}
		/>
	);
}
