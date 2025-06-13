import * as am5stock from '@amcharts/amcharts5/stock';
import React, { useEffect, useState, type PropsWithChildren } from 'react';

import type { ChartContainer } from './ChartContainer';

type ChartPropsWithChildren = PropsWithChildren<
	Partial<
		ChartContainer & {
			settings: am5stock.IStockChartSettings;
		}
	>
>;

export type StockChart = {
	stockChart: am5stock.StockChart | null;
} & ChartContainer;

export default function StockChart({
	chartRoot,
	settings = {},
	children,
}: ChartPropsWithChildren) {
	const [stockChart, setStockChart] = useState<StockChart['stockChart']>(null);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<StockChart>(child)) {
			return React.cloneElement(child, { chartRoot, stockChart });
		}
		return child;
	});

	useEffect(() => {
		if (!chartRoot || stockChart) return;
		const schart = chartRoot.container.children.push(
			am5stock.StockChart.new(chartRoot, settings),
		);
		setStockChart(schart);

		return () => {
			if (!schart) return;
			schart.dispose();
		};
	}, [stockChart, chartRoot, settings]);

	return childrenWithProps;
}
