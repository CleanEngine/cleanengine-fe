import * as am5xy from '@amcharts/amcharts5/xy';
import { type PropsWithChildren, useEffect } from 'react';
import type { SbSeries } from './SbSeries';

type SbDateAxisProps = PropsWithChildren<Partial<SbSeries>>;

export default function SbDateAxis({
	children,
	sbDateAxisRef,
	chartRootRef,
	scrollbarRef,
}: SbDateAxisProps) {
	useEffect(() => {
		if (
			!sbDateAxisRef ||
			!chartRootRef ||
			!chartRootRef.current ||
			!scrollbarRef ||
			!scrollbarRef.current
		)
			return;

		sbDateAxisRef.current = scrollbarRef.current.chart.xAxes.push(
			am5xy.GaplessDateAxis.new(chartRootRef.current, {
				baseInterval: {
					timeUnit: 'minute',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(chartRootRef.current, {
					minorGridEnabled: true,
				}),
			}),
		);
	}, [sbDateAxisRef, chartRootRef, scrollbarRef]);

	return children;
}
