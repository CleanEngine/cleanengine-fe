import * as am5stock from '@amcharts/amcharts5/stock';
import React, { type PropsWithChildren } from 'react';

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
	chartToolbarContainerRef,
	settings = {},
	children,
}: ChartPropsWithChildren) {
	if (!chartRoot) {
		return null;
	}

	const stockChart = chartRoot?.container.children.push(
		am5stock.StockChart.new(chartRoot, settings),
	);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<StockChart>(child)) {
			return React.cloneElement(child, {
				chartRoot,
				stockChart,
				chartToolbarContainerRef,
			});
		}
		return child;
	});

	return childrenWithProps;
}
