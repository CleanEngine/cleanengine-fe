import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import type { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import type { MainPanel } from './MainPanel';

type StockAxisProps = PropsWithChildren<Partial<MainPanel>>;

export type StockAxis = {
	dateAxis: am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null;
	valueAxis: am5xy.ValueAxis<am5xy.AxisRenderer> | null;
} & MainPanel;

export default function StockAxis({
	chartRoot,
	stockChart,
	mainPanel,
	children,
}: StockAxisProps) {
	if (!chartRoot || !stockChart || !mainPanel) {
		return null;
	}

	const dateAxis = mainPanel.xAxes.push(
		am5xy.GaplessDateAxis.new(chartRoot, {
			baseInterval: {
				timeUnit: 'minute',
				count: 1,
			},
			renderer: am5xy.AxisRendererX.new(chartRoot, {
				minorGridEnabled: true,
			}),
			tooltip: am5.Tooltip.new(chartRoot, {}),
		}),
	);

	const valueAxis = mainPanel.yAxes.push(
		am5xy.ValueAxis.new(chartRoot, {
			renderer: am5xy.AxisRendererY.new(chartRoot, {
				pan: 'zoom',
			}),
			extraMin: 0.1,
			tooltip: am5.Tooltip.new(chartRoot, {}),
			numberFormat: '#,###.00',
			extraTooltipPrecision: 2,
		}),
	);

	valueAxis.createAxisRange(valueAxis.makeDataItem({ value: 0 }));

	mainPanel.set(
		'cursor',
		am5xy.XYCursor.new(chartRoot, {
			yAxis: valueAxis,
			xAxis: dateAxis,
			snapToSeries: valueAxis.series,
			snapToSeriesBy: 'y!',
		}),
	);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<StockAxis>(child)) {
			return React.cloneElement(child, {
				chartRoot,
				stockChart,
				mainPanel,
				dateAxis,
				valueAxis,
			});
		}
		return child;
	});

	useEffect(() => {
		return () => {
			dateAxis.dispose();
			valueAxis.dispose();
		};
	}, [dateAxis, valueAxis]);

	return childrenWithProps;
}
