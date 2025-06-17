import * as am5stock from '@amcharts/amcharts5/stock';
import * as am5xy from '@amcharts/amcharts5/xy';
import type { PropsWithChildren } from 'react';

import { isNullish } from '~/shared/utils';
import type { CandlestickData } from '../../types/tradeview.type';
import { isDisposed } from '../../utils';
import type { StockAxis } from './StockAxis';

export type SeriesSettings = {
	name?: string;
	clustered?: boolean;
	legendValueText?: string;
	legendRangeValueText?: string;
};

export type ValueSeriesProps = PropsWithChildren<
	Partial<StockAxis> & {
		pastTimeData?: CandlestickData[];
		seriesSettings?: SeriesSettings;
		fetchPastTimeData?: () => Promise<void>;
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
	fetchPastTimeData,
}: ValueSeriesProps) {
	if (
		isNullish(chartRoot) ||
		isNullish(stockChart) ||
		isNullish(mainPanel) ||
		isNullish(valueAxis) ||
		isNullish(dateAxis)
	) {
		console.error('ValueSeries should be used within StockAxis');
		return;
	}

	if (isDisposed(chartRoot, stockChart, mainPanel, valueAxis, dateAxis)) return;

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

	dateAxis.on('start', async (value) => {
		if (!value) return;

		if (value < 0) {
			fetchPastTimeData?.();
			// dateAxis.zoom(0, 1, 0);
		}
	});

	newValueSeries.data.clear();
	newValueSeries.data.setAll(pastTimeData || []);

	return children;
}
