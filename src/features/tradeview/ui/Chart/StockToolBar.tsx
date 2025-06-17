import * as am5stock from '@amcharts/amcharts5/stock';
import { type PropsWithChildren, useEffect } from 'react';
import type { StockChart } from './StockChart';

type StockToolBarProps = PropsWithChildren<Partial<StockChart>>;

export default function StockToolBar({
	chartRoot,
	stockChart,
	chartToolbarContainerRef,
	children,
}: StockToolBarProps) {
	useEffect(() => {
		if (!chartRoot || !stockChart || !chartToolbarContainerRef?.current) return;

		const toolbar = am5stock.StockToolbar.new(chartRoot, {
			stockChart: stockChart,
			container: chartToolbarContainerRef.current,
			controls: [
				am5stock.IndicatorControl.new(chartRoot, {
					stockChart: stockChart,
				}),
				am5stock.DateRangeSelector.new(chartRoot, {
					stockChart: stockChart,
				}),
				am5stock.DrawingControl.new(chartRoot, {
					stockChart: stockChart,
				}),
				am5stock.ResetControl.new(chartRoot, {
					stockChart: stockChart,
				}),
				am5stock.DataSaveControl.new(chartRoot, {
					stockChart: stockChart,
					storageId: 'invest-future-chart',
					autoSave: true,
				}),
				am5stock.SettingsControl.new(chartRoot, {
					stockChart: stockChart,
				}),
			],
		});

		return () => {
			toolbar.dispose();
		};
	}, [chartRoot, stockChart, chartToolbarContainerRef]);

	return children;
}
