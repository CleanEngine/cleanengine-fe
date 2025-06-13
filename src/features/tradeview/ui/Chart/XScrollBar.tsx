import * as am5xy from '@amcharts/amcharts5/xy';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { MainPanel } from './MainPanel';

type XScrollBarProps = PropsWithChildren<Partial<MainPanel>>;

export type XScrollBar = {
	scrollbarRef: React.RefObject<am5xy.XYChartScrollbar | null>;
} & Pick<MainPanel, 'chartRootRef'>;

export default function XScrollBar({
	children,
	stockChartRef,
	chartRootRef,
	mainPanelRef,
}: XScrollBarProps) {
	const scrollbarRef = useRef<XScrollBar['scrollbarRef']['current']>(null);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<XScrollBar>(child)) {
			return React.cloneElement(child, { scrollbarRef, chartRootRef });
		}
		return child;
	});

	useEffect(() => {
		if (
			!mainPanelRef ||
			!mainPanelRef.current ||
			!chartRootRef ||
			!chartRootRef.current ||
			!stockChartRef ||
			!stockChartRef.current
		)
			return;
		scrollbarRef.current = mainPanelRef.current.set(
			'scrollbarX',
			am5xy.XYChartScrollbar.new(chartRootRef.current, {
				orientation: 'horizontal',
				height: 50,
			}),
		);

		stockChartRef.current.toolsContainer.children.push(scrollbarRef.current);
	}, [stockChartRef, chartRootRef, mainPanelRef]);

	return childrenWithProps;
}
