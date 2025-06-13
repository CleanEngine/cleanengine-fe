import * as am5xy from '@amcharts/amcharts5/xy';
import { type PropsWithChildren, useEffect, useState } from 'react';
import type { CandlestickData } from '../../types/tradeview.type';
import type { StockAxis } from './StockAxis';

type ValueSeriesProps = PropsWithChildren<
	Partial<StockAxis> & {
		pastTimeData?: CandlestickData[];
	}
>;

export default function ValueSeries({
	children,
	chartRoot,
	stockChart,
	mainPanel,
	valueAxis,
	dateAxis,
	pastTimeData,
}: ValueSeriesProps) {
	const [valueSeries, setValueSeries] =
		useState<am5xy.CandlestickSeries | null>(null);

	useEffect(() => {
		if (!valueSeries || !pastTimeData) return;
		valueSeries.data.setAll(pastTimeData);
	}, [valueSeries, pastTimeData]);

	useEffect(() => {
		if (!mainPanel || !chartRoot || !stockChart || !valueAxis || !dateAxis)
			return;
		const newValueSeries = mainPanel.series.push(
			am5xy.CandlestickSeries.new(chartRoot, {
				name: 'MSFT',
				clustered: false,
				valueXField: 'Timestamp',
				valueYField: 'Close',
				highValueYField: 'High',
				lowValueYField: 'Low',
				openValueYField: 'Open',
				calculateAggregates: true,
				xAxis: dateAxis,
				yAxis: valueAxis,
				legendValueText:
					'open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]',
				legendRangeValueText: '',
			}),
		);

		stockChart.set('stockSeries', newValueSeries);
		mainPanel.set(
			'cursor',
			am5xy.XYCursor.new(chartRoot, {
				yAxis: valueAxis,
				xAxis: dateAxis,
				snapToSeries: [newValueSeries],
				snapToSeriesBy: 'y!',
			}),
		);
		setValueSeries(newValueSeries);

		return () => {
			newValueSeries.dispose();
		};
	}, [valueAxis, mainPanel, stockChart, dateAxis, chartRoot]);

	return children;
}
