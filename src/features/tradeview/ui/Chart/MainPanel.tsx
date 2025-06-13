import * as am5 from '@amcharts/amcharts5';
import * as am5stock from '@amcharts/amcharts5/stock';
import * as am5xy from '@amcharts/amcharts5/xy';

import React, { type PropsWithChildren, useEffect, useState } from 'react';
import type { StockChart } from './StockChart';

type MainPanelProps = PropsWithChildren<Partial<StockChart>>;

export type MainPanel = {
	mainPanel: am5stock.StockPanel | null;
	dateAxis: am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null;
	valueAxis: am5xy.ValueAxis<am5xy.AxisRenderer> | null;
	valueLegend: am5stock.StockLegend | null;
} & StockChart;

export default function MainPanel({
	chartRoot,
	stockChart,
	children,
}: MainPanelProps) {
	const [mainPanel, setMainPanel] = useState<MainPanel['mainPanel']>(null);
	const [dateAxis, setDateAxis] = useState<MainPanel['dateAxis']>(null);
	const [valueAxis, setValueAxis] = useState<MainPanel['valueAxis']>(null);
	const [valueLegend, setValueLegend] =
		useState<MainPanel['valueLegend']>(null);

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement<MainPanel>(child)) {
			return React.cloneElement(child, {
				chartRoot,
				stockChart,
				mainPanel,
				dateAxis,
				valueAxis,
				valueLegend,
			});
		}
		return child;
	});

	useEffect(() => {
		if (!chartRoot || !stockChart) return;
		const newPanel = stockChart.panels.push(
			am5stock.StockPanel.new(chartRoot, {
				wheelY: 'zoomX',
				panX: true,
				panY: true,
			}),
		);
		setMainPanel(newPanel);

		const newDateAxis = newPanel.xAxes.push(
			am5xy.GaplessDateAxis.new(chartRoot, {
				baseInterval: {
					timeUnit: 'minute',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(chartRoot, {
					minorGridEnabled: true,
				}),
				tooltip: am5.Tooltip.new(chartRoot, {}),
			}),
		);

		setDateAxis(newDateAxis);

		const newValueLegend = newPanel.plotContainer.children.push(
			am5stock.StockLegend.new(chartRoot, {
				stockChart,
			}),
		);

		setValueLegend(newValueLegend);

		const newValueAxis = newPanel.yAxes.push(
			am5xy.ValueAxis.new(chartRoot, {
				renderer: am5xy.AxisRendererY.new(chartRoot, {
					pan: 'zoom',
				}),
				extraMin: 0.1,
				tooltip: am5.Tooltip.new(chartRoot, {}),
				numberFormat: '#,###.00',
				extraTooltipPrecision: 2,
			}),
		);

		setValueAxis(newValueAxis);

		newPanel.set(
			'cursor',
			am5xy.XYCursor.new(chartRoot, {
				yAxis: newValueAxis,
				xAxis: newDateAxis,
				snapToSeries: newValueAxis.series,
				snapToSeriesBy: 'y!',
			}),
		);

		return () => {
			newPanel.dispose();
		};
	}, [chartRoot, stockChart]);

	return childrenWithProps;
}
