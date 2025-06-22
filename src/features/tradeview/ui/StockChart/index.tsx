import type {
	CandlestickData,
	DeepPartial,
	IChartApi,
	ISeriesApi,
	LogicalRangeChangeEventHandler,
	Time,
	TimeChartOptions,
} from 'lightweight-charts';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import api from '../../api/tradeview.endpoints';
import usePastTimeData from '../../hooks/usePastTimeData';
import useRealTimeData from '../../hooks/useRealTimeData';
import { extractCandlestickData, timestampToISOString } from '../../utils';
import ChartContainer from './ChartContainer';
import ChartRoot from './ChartRoot';
import Series from './Series';

type ChartProps = {
	ticker?: string;
	interval?: number;
	count?: number;
};

export default function Chart({
	ticker = 'BTC',
	interval = 1,
	count = 10,
}: ChartProps) {
	const chartRef = useRef<IChartApi>(null);
	const seriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
	const [isChartReady, setIsChartReady] = useState(false);
	const realTimeData = useRealTimeData(ticker);
	const pastTimeData = usePastTimeData(ticker, interval, count);

	const chartOption: DeepPartial<TimeChartOptions> = useMemo(() => {
		return {
			timeScale: { timeVisible: true },
			localization: {
				locale: 'kr',
				dateFormat: 'yyyy-MM-dd',
			},
			rightPriceScale: {
				borderVisible: false,
			},
		};
	}, []);

	useLayoutEffect(() => {
		if (
			!chartRef.current ||
			!seriesRef.current ||
			!isChartReady ||
			!pastTimeData.length
		)
			return;

		const convertedData = extractCandlestickData(pastTimeData);
		seriesRef.current.setData(convertedData);
		chartRef.current.timeScale().applyOptions({
			borderVisible: false,
		});
		chartRef.current.timeScale().fitContent();
	}, [isChartReady, pastTimeData]);

	useLayoutEffect(() => {
		if (!chartRef.current || !isChartReady) return;

		const handleVisibleRangeChange: LogicalRangeChangeEventHandler = async (
			logicalRange,
		) => {
			if (!logicalRange) return;
			if (logicalRange.from < -0.5) {
				const firstData = seriesRef.current?.dataByIndex(0) as CandlestickData;
				if (!firstData || !firstData.time) return;

				const firstDate = timestampToISOString(firstData.time as number);

				const response = await api.getPastData(
					ticker,
					interval,
					count,
					firstDate,
				);
				const pastData = await response.json();

				if (!pastData.length) return;

				const pastCandlestickData = extractCandlestickData(pastData);

				const previousData = seriesRef.current?.data().values() || [];
				seriesRef.current?.setData([...pastCandlestickData, ...previousData]);
			}
		};

		chartRef.current
			.timeScale()
			.subscribeVisibleLogicalRangeChange(handleVisibleRangeChange);

		return () => {
			chartRef.current
				?.timeScale()
				.unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
		};
	}, [isChartReady, count, interval, ticker]);

	useLayoutEffect(() => {
		if (!realTimeData || !realTimeData.time) return;
		const latestTime = seriesRef.current?.data().at(-1);

		if (!latestTime) {
			seriesRef.current?.setData([realTimeData]);
			return;
		}

		const timeDiff = +realTimeData.time - +latestTime.time;

		if (timeDiff < 60 * interval) {
			seriesRef.current?.update({ ...realTimeData, time: latestTime.time });
		} else {
			seriesRef.current?.update({
				...realTimeData,
				time: (+latestTime.time + 60 * interval) as Time,
			});
		}
	}, [realTimeData, interval]);

	return (
		<ChartRoot>
			<ChartContainer
				ref={chartRef}
				layout={{
					textColor: 'black',
				}}
				onChartReady={() => setIsChartReady(true)}
				chartOption={chartOption}
			>
				<Series ref={seriesRef} seriesType="Candlestick" />
			</ChartContainer>
		</ChartRoot>
	);
}
