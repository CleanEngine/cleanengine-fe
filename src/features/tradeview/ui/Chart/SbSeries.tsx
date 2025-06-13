import * as am5xy from '@amcharts/amcharts5/xy';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import type { CandlestickData } from '../../types/tradeview.type';
import type { XScrollBar } from './XScrollBar';

type SbSeriesProps = PropsWithChildren<
	Partial<XScrollBar> & { pastTimeData?: CandlestickData[] }
>;

export type SbSeries = {
	sbSeriesRef: React.RefObject<am5xy.LineSeries | null>;
	sbValueAxisRef: React.RefObject<am5xy.ValueAxis<am5xy.AxisRenderer> | null>;
	sbDateAxisRef: React.RefObject<am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null>;
} & XScrollBar;

export default function SbSeries({
	children,
	scrollbarRef,
	chartRootRef,
	pastTimeData,
}: SbSeriesProps) {
	const sbSeriesRef = useRef<SbSeries['sbSeriesRef']['current']>(null);
	const sbValueAxisRef = useRef<SbSeries['sbValueAxisRef']['current']>(null);
	const sbDateAxisRef = useRef<SbSeries['sbDateAxisRef']['current']>(null);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<SbSeries>(child)) {
			return React.cloneElement(child, {
				sbSeriesRef,
				sbValueAxisRef,
				sbDateAxisRef,
			});
		}
		return child;
	});

	useEffect(() => {
		if (!pastTimeData || !pastTimeData.length || !sbSeriesRef.current) return;
		console.log(pastTimeData);
		sbSeriesRef.current.data.setAll(pastTimeData);
	}, [pastTimeData]);

	useEffect(() => {
		if (
			!scrollbarRef ||
			!scrollbarRef.current ||
			!chartRootRef ||
			!chartRootRef.current ||
			!sbDateAxisRef.current ||
			!sbValueAxisRef.current
		)
			return;

		sbSeriesRef.current = scrollbarRef.current.chart.series.push(
			am5xy.LineSeries.new(chartRootRef.current, {
				valueYField: 'Close',
				valueXField: 'Timestamp',
				xAxis: sbDateAxisRef.current,
				yAxis: sbValueAxisRef.current,
			}),
		);

		sbSeriesRef.current.fills.template.setAll({
			visible: true,
			fillOpacity: 0.3,
		});
	}, [scrollbarRef, chartRootRef]);

	return childrenWithProps;
}
