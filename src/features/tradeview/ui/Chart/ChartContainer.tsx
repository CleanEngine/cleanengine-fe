import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import React, { useEffect, useRef, useState, type ReactNode } from 'react';

export type ChartContainerProps = {
	containerId: string;
	toolbarId: string;
	children: ReactNode;
};

export type ChartContainer = {
	chartRoot: am5.Root | null;
	chartToolbarContainerRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChartContainer({
	containerId,
	toolbarId,
	children,
}: ChartContainerProps) {
	const [chartRoot, setChartRoot] = useState<ChartContainer['chartRoot']>(null);
	const chartToolbarContainerRef =
		useRef<ChartContainer['chartToolbarContainerRef']['current']>(null);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<ChartContainer>(child)) {
			return React.cloneElement(child, { chartRoot });
		}
		return child;
	});

	useEffect(() => {
		if (chartRoot) return;
		const root = am5.Root.new(containerId);

		const Theme = am5.Theme.new(root);
		Theme.rule('Grid', ['scrollbar', 'minor']).setAll({
			visible: false,
		});

		root.setThemes([am5themes_Animated.new(root), Theme]);

		setChartRoot(root);

		return () => {
			if (!chartRoot) return;
			root.dispose();
		};
	}, [containerId, chartRoot]);

	return (
		<>
			<div id={toolbarId} ref={chartToolbarContainerRef} />
			<div id={containerId} className="h-full">
				{childrenWithProps}
			</div>
		</>
	);
}
