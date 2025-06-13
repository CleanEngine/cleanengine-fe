import * as am5stock from '@amcharts/amcharts5/stock';
import { type PropsWithChildren, useEffect } from 'react';
import type { MainPanel } from './MainPanel';

type StockToolBarProps = PropsWithChildren<Partial<MainPanel>>;

export default function StockToolBar({
	stockChartRef,
	chartRootRef,
	chartToolbarContainerRef,
	valueLegendRef,
	children,
}: StockToolBarProps) {
	useEffect(() => {
		if (
			!chartRootRef ||
			!chartRootRef.current ||
			!stockChartRef ||
			!stockChartRef.current ||
			!chartToolbarContainerRef ||
			!chartToolbarContainerRef.current ||
			!valueLegendRef ||
			!valueLegendRef.current
		)
			return;
		const toolbar = am5stock.StockToolbar.new(chartRootRef.current, {
			container: chartToolbarContainerRef.current,
			stockChart: stockChartRef.current,
			controls: [
				am5stock.IndicatorControl.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
					legend: valueLegendRef.current,
				}),
				am5stock.DateRangeSelector.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.PeriodSelector.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.SeriesTypeControl.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.DrawingControl.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.DataSaveControl.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.ResetControl.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.SettingsControl.new(chartRootRef.current, {
					stockChart: stockChartRef.current,
				}),
			],
		});

		return () => {
			toolbar.dispose();
		};
	}, [stockChartRef, chartRootRef, chartToolbarContainerRef, valueLegendRef]);

	return children;
}
