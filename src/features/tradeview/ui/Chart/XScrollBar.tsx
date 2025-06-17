import * as am5xy from '@amcharts/amcharts5/xy';
import React, { useEffect, useState, type PropsWithChildren } from 'react';

import { isNullish } from '~/shared/utils';
import { isDisposed } from '../../utils';
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

	useEffect(() => {
		if (isNullish(chartRoot) || isNullish(stockChart) || isNullish(mainPanel)) {
			console.error('XScrollBar should be used within MainPanel');
			return;
		}

		if (isDisposed(chartRoot, stockChart, mainPanel)) return;

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

	return childrenWithProps;
}
