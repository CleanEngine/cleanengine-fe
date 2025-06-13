import * as am5xy from '@amcharts/amcharts5/xy';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import type { MainPanel } from './MainPanel';

type XScrollBarProps = PropsWithChildren<Partial<MainPanel>>;

export type XScrollBar = {
	scrollbar: am5xy.XYChartScrollbar | null;
} & MainPanel;

export default function XScrollBar({
	children,
	stockChart,
	chartRoot,
	mainPanel,
}: XScrollBarProps) {
	const [scrollbar, setScrollbar] = useState<am5xy.XYChartScrollbar | null>(
		null,
	);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<XScrollBar>(child)) {
			return React.cloneElement(child, {
				scrollbar,
				chartRoot,
				stockChart,
				mainPanel,
			});
		}
		return child;
	});

	useEffect(() => {
		if (!mainPanel || !chartRoot || !stockChart) return;
		const newScrollbar = mainPanel.set(
			'scrollbarX',
			am5xy.XYChartScrollbar.new(chartRoot, {
				orientation: 'horizontal',
				height: 50,
			}),
		);

		stockChart.toolsContainer.children.push(newScrollbar);

		setScrollbar(newScrollbar);

		return () => {
			stockChart.toolsContainer.children.removeValue(newScrollbar);
		};
	}, [chartRoot, mainPanel, stockChart]);

	return childrenWithProps;
}
