import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import React, { useEffect, useRef, useState, type ReactNode } from 'react';

export type ChartContainerProps = {
	containerId: string;
	toolbarId: string;
	children: ReactNode;
};

export type ChartContainer = {
	chartRoot: am5.Root;
	chartToolbarContainerRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChartContainer({
	containerId,
	toolbarId,
	children,
}: ChartContainerProps) {
	const [chartRoot, setChartRoot] = useState<
		ChartContainer['chartRoot'] | null
	>(null);
	const chartToolbarContainerRef =
		useRef<ChartContainer['chartToolbarContainerRef']['current']>(null);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<ChartContainer>(child) && chartRoot) {
			return React.cloneElement(child, { chartRoot: chartRoot });
		}
		return child;
	});

	useEffect(() => {
		const root = am5.Root.new(containerId);

		const Theme = am5.Theme.new(root);
		Theme.rule('Grid', ['scrollbar', 'minor']).setAll({
			visible: false,
		});

		root.setThemes([am5themes_Animated.new(root), Theme]);
		root.numberFormatter.set('numberFormat', '#,###.00');

		setChartRoot(root);

		return () => {
			root.dispose();
		};
	}, [containerId]);

	return (
		<>
			<div id={toolbarId} ref={chartToolbarContainerRef} />
			<div id={containerId} className="h-full">
				{chartRoot && childrenWithProps}
			</div>
		</>
	);
}
