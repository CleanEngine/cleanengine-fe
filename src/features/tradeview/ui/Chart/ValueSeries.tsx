import * as am5xy from '@amcharts/amcharts5/xy';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import type { CandlestickData } from '../../types/tradeview.type';
import type { MainPanel } from './MainPanel';

type ValueSeriesProps = PropsWithChildren<
	Partial<MainPanel> & {
		pastTimeData?: CandlestickData[];
	}
>;

export default function ValueSeries({
	children,
	mainPanelRef,
	valueAxisRef,
	dateAxisRef,
	stockChartRef,
	pastTimeData,
}: ValueSeriesProps) {
	const [isSeriesCreated, setIsSeriesCreated] = useState(false);
	const valueSeriesRef = useRef<am5xy.CandlestickSeries>(null);

	useEffect(() => {
		if (!pastTimeData || !valueSeriesRef.current || !isSeriesCreated) return;
		console.log('🚀 ~ useEffect ~ pastTimeData:', pastTimeData);
		valueSeriesRef.current.data.setAll(pastTimeData);
	}, [pastTimeData, isSeriesCreated]);

	useEffect(() => {
		if (
			!mainPanelRef ||
			!mainPanelRef.current ||
			!valueAxisRef ||
			!valueAxisRef.current ||
			!dateAxisRef ||
			!dateAxisRef.current ||
			!stockChartRef ||
			!stockChartRef.current
		)
			return;

		console.log('실행되니?');
		valueSeriesRef.current = mainPanelRef.current.series.push(
			am5xy.CandlestickSeries.new(mainPanelRef.current.root, {
				name: 'MSFT',
				clustered: false,
				valueXField: 'Timestamp',
				valueYField: 'Close',
				highValueYField: 'High',
				lowValueYField: 'Low',
				openValueYField: 'Open',
				calculateAggregates: true,
				xAxis: dateAxisRef.current,
				yAxis: valueAxisRef.current,
				legendValueText:
					'open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]',
				legendRangeValueText: '',
			}),
		);

		stockChartRef.current.set('stockSeries', valueSeriesRef.current);
		setIsSeriesCreated(true);
	}, [mainPanelRef, valueAxisRef, dateAxisRef, stockChartRef]);

	return children;
}
