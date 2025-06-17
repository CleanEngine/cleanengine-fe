import * as am5xy from '@amcharts/amcharts5/xy';
import { type PropsWithChildren, useEffect, useState } from 'react';

import { isNullish } from '~/shared/utils';
import type { CandlestickData } from '../../types/tradeview.type';
import { isDisposed } from '../../utils';
import type { XScrollBar } from './XScrollBar';

type SbSeriesProps = PropsWithChildren<
	Partial<XScrollBar> & { pastTimeData?: CandlestickData[] }
>;

export type SbSeries = {
	sbSeries: am5xy.LineSeries | null;
	sbValueAxis: am5xy.ValueAxis<am5xy.AxisRenderer> | null;
	sbDateAxis: am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null;
} & XScrollBar;

export default function SbSeries({
	scrollbar,
	chartRoot,
	stockChart,
	pastTimeData,
	mainPanel,
	children,
}: SbSeriesProps) {
	const [sbSeries, setSbSeries] = useState<SbSeries['sbSeries']>(null);

	useEffect(() => {
		if (
			isNullish(pastTimeData) ||
			isNullish(pastTimeData.length) ||
			isNullish(sbSeries)
		)
			return;

		sbSeries.data.setAll(pastTimeData);
	}, [pastTimeData, sbSeries]);

	useEffect(() => {
		if (
			isNullish(scrollbar) ||
			isNullish(chartRoot) ||
			isNullish(stockChart) ||
			isNullish(mainPanel)
		) {
			console.error('SbSeries should be used within XScrollBar');
			return;
		}

		if (isDisposed(scrollbar, chartRoot, stockChart, mainPanel)) return;

		const newSbDateAxis = scrollbar.chart.xAxes.push(
			am5xy.GaplessDateAxis.new(chartRoot, {
				baseInterval: {
					timeUnit: 'minute',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(chartRoot, {
					minorGridEnabled: true,
				}),
			}),
		);

		const newSbValueAxis = scrollbar.chart.yAxes.push(
			am5xy.ValueAxis.new(chartRoot, {
				renderer: am5xy.AxisRendererY.new(chartRoot, {}),
			}),
		);

		const newSbSeries = scrollbar.chart.series.push(
			am5xy.LineSeries.new(chartRoot, {
				valueYField: 'Close',
				valueXField: 'Timestamp',
				xAxis: newSbDateAxis,
				yAxis: newSbValueAxis,
			}),
		);

		newSbSeries.fills.template.setAll({
			visible: true,
			fillOpacity: 0.3,
		});

		setSbSeries(newSbSeries);

		return () => {
			newSbDateAxis.dispose();
			newSbValueAxis.dispose();
			newSbSeries.dispose();
		};
	}, [scrollbar, chartRoot, stockChart, mainPanel]);

	return children;
}
