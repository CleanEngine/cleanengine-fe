import * as am5stock from '@amcharts/amcharts5/stock';
import * as am5xy from '@amcharts/amcharts5/xy';
import { type PropsWithChildren, useEffect, useState } from 'react';
import type { CandlestickData } from '../../types/tradeview.type';
import type { StockAxis } from './StockAxis';

type SeriesSettings = {
	name?: string;
	clustered?: boolean;
	legendValueText?: string;
	legendRangeValueText?: string;
};

type ValueSeriesProps = PropsWithChildren<
	Partial<StockAxis> & {
		pastTimeData?: CandlestickData[];
		seriesSettings?: SeriesSettings;
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
	seriesSettings,
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
				name: seriesSettings?.name || 'MSFT',
				clustered: seriesSettings?.clustered || false,
				valueXField: 'Timestamp',
				valueYField: 'Close',
				highValueYField: 'High',
				lowValueYField: 'Low',
				openValueYField: 'Open',
				calculateAggregates: true,
				xAxis: dateAxis,
				yAxis: valueAxis,
				legendValueText:
					seriesSettings?.legendValueText ||
					'시작가: [bold]{openValueY}[/] 최고가: [bold]{highValueY}[/] 최저가: [bold]{lowValueY}[/] 종가: [bold]{valueY}[/]',
				legendRangeValueText: seriesSettings?.legendRangeValueText || '',
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

		const volumeSeries = mainPanel.series.push(
			am5xy.ColumnSeries.new(chartRoot, {
				name: 'Volume',
				valueXField: 'Timestamp',
				valueYField: 'Volume',
				xAxis: dateAxis,
				yAxis: valueAxis,
				legendValueText: '[bold]{valueY}',
				legendRangeValueText: '',
			}),
		);

		const valueLegend = mainPanel.plotContainer.children.push(
			am5stock.StockLegend.new(chartRoot, {
				stockChart: stockChart,
			}),
		);

		valueLegend.data.setAll([newValueSeries]);

		return () => {
			newValueSeries.dispose();
			valueLegend.dispose();
		};
	}, [valueAxis, mainPanel, stockChart, dateAxis, chartRoot, seriesSettings]);

	return children;
}
