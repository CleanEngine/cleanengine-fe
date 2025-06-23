import type {
	CandlestickData,
	DeepPartial,
	IChartApi,
	ISeriesApi,
	LogicalRangeChangeEventHandler,
	Time,
	TimeChartOptions,
} from 'lightweight-charts';
import {
	type MouseEvent,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import ChartContainer from './ChartContainer';
import ChartRoot from './ChartRoot';
import Series from './Series';
import ToolTip from './ToolTip';

import api from '../../api/tradeview.endpoints';
import { INTERVALS } from '../../const/chart.const';
import usePastTimeData from '../../hooks/usePastTimeData';
import useRealTimeData from '../../hooks/useRealTimeData';
import { extractCandlestickData, timestampToISOString } from '../../utils';
import IntervalSelector from '../IntervalSelector';

type ChartProps = {
	ticker?: string;
	count?: number;
};

export default function Chart({ ticker = 'BTC', count = 30 }: ChartProps) {
	const [selectedInterval, setSelectedInterval] = useState(1);
	const chartRef = useRef<IChartApi>(null);
	const seriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
	const [isChartReady, setIsChartReady] = useState(false);
	const realTimeData = useRealTimeData(ticker);
	const pastTimeData = usePastTimeData(ticker, selectedInterval, count);

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
			crosshair: {
				horzLine: {
					visible: true,
					labelVisible: true,
				},
				vertLine: {
					labelVisible: true,
				},
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
					selectedInterval,
					count,
					firstDate,
				);
				const pastData = await response.json();

				if (!pastData.length) return;

				const previousData = seriesRef.current?.data() || [];

				const pastCandlestickData = extractCandlestickData(pastData).filter(
					(data) => {
						const prevTime = previousData.at(0)?.time;
						if (!prevTime) return true;
						return data.time < prevTime;
					},
				);
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
	}, [isChartReady, count, selectedInterval, ticker]);

	useLayoutEffect(() => {
		if (!realTimeData || !realTimeData.time) return;
		const latestTime = seriesRef.current?.data().at(-1);

		if (!latestTime) {
			seriesRef.current?.setData([realTimeData]);
			return;
		}

		const timeDiff = +realTimeData.time - +latestTime.time;

		if (timeDiff < 60 * selectedInterval) {
			seriesRef.current?.update({ ...realTimeData, time: latestTime.time });
		} else {
			seriesRef.current?.update({
				...realTimeData,
				time: (+latestTime.time + 60 * selectedInterval) as Time,
			});
		}
	}, [realTimeData, selectedInterval]);

	const handleSelectInterval = (e: MouseEvent<HTMLButtonElement>) => {
		setSelectedInterval(Number(e.currentTarget.value));
	};

	return (
		<ChartRoot>
			<IntervalSelector
				intervals={INTERVALS}
				onSelectInterval={handleSelectInterval}
				selectedInterval={selectedInterval}
			/>
			<ChartContainer
				ref={chartRef}
				layout={{
					textColor: 'black',
				}}
				onChartReady={() => setIsChartReady(true)}
				chartOption={chartOption}
			>
				<Series ref={seriesRef} seriesType="Candlestick">
					<ToolTip />
				</Series>
			</ChartContainer>
		</ChartRoot>
	);
}
