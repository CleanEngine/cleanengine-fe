import * as am5stock from '@amcharts/amcharts5/stock';
import React, { useEffect, type PropsWithChildren } from 'react';

import type { StockChart } from './StockChart';

type MainPanelProps = PropsWithChildren<Partial<StockChart>>;

export type MainPanel = {
	mainPanel: am5stock.StockPanel | null;
} & StockChart;

export default function MainPanel({
	chartRoot,
	stockChart,
	children,
}: MainPanelProps) {
	if (!chartRoot || !stockChart) {
		console.error('MainPanel should be used within StockChart');
		return null;
	}

	const mainPanel = stockChart.panels.push(
		am5stock.StockPanel.new(chartRoot, {
			wheelY: 'zoomX',
			panX: true,
			panY: true,
		}),
	);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<MainPanel>(child)) {
			return React.cloneElement(child, {
				chartRoot,
				stockChart,
				mainPanel,
			});
		}
		return child;
	});

	useEffect(() => {
		return () => {
			mainPanel.dispose();
		};
	}, [mainPanel]);

	return childrenWithProps;
}
