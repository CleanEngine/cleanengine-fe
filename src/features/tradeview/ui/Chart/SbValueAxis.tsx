import * as am5xy from '@amcharts/amcharts5/xy';
import { type PropsWithChildren, useEffect } from 'react';
import type { SbSeries } from './SbSeries';

type SbValueAxisProps = PropsWithChildren<Partial<SbSeries>>;

export default function SbValueAxis({
	children,
	sbValueAxisRef,
	chartRootRef,
	scrollbarRef,
}: SbValueAxisProps) {
	useEffect(() => {
		if (
			!sbValueAxisRef ||
			!chartRootRef ||
			!chartRootRef.current ||
			!scrollbarRef ||
			!scrollbarRef.current
		)
			return;

		sbValueAxisRef.current = scrollbarRef.current.chart.yAxes.push(
			am5xy.ValueAxis.new(chartRootRef.current, {
				renderer: am5xy.AxisRendererY.new(chartRootRef.current, {}),
			}),
		);
	}, [sbValueAxisRef, chartRootRef, scrollbarRef]);

	return children;
}
