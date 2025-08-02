import {
	type ChartOptions,
	type DeepPartial,
	type IChartApi,
	type ISeriesApi,
	type LayoutOptions,
	type SeriesType,
	createChart,
} from 'lightweight-charts';
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from 'react';

import { INTERVAL_SELECTOR_HEIGHT } from '../../../features/tradeview/const/chart.const';
import { useChartRoot } from './ChartRoot';

type ChartContainerProps = PropsWithChildren<{
	layout?: DeepPartial<LayoutOptions>;
	chartOption?: DeepPartial<ChartOptions>;
	ref?: React.RefObject<IChartApi | null>;
	onChartReady?: () => void;
}>;

type ChartApi = {
	_instance: IChartApi | null;
	isRemoved: boolean;
	getInstance(): IChartApi;
	free(series: ISeriesApi<SeriesType>): void;
};

const ChartContainerContext = createContext<ChartApi | null>(null);

export default function ChartContainer({
	children,
	layout,
	chartOption,
	ref,
	onChartReady,
}: ChartContainerProps) {
	const { root } = useChartRoot();

	const chartApiRef = useRef<ChartApi>({
		_instance: null,
		isRemoved: false,
		getInstance() {
			if (!root) {
				throw new Error('ChartCotainer should be used within ChartRoot');
			}

			if (!this._instance) {
				this._instance = createChart(root, {
					...chartOption,
					layout,
					width: root.clientWidth,
					height: root.clientHeight - INTERVAL_SELECTOR_HEIGHT,
				});
				this._instance.timeScale().fitContent();
			}

			return this._instance;
		},
		free(series) {
			if (!this._instance) return;

			this._instance.removeSeries(series);
		},
	});

	useLayoutEffect(() => {
		const chartApi = chartApiRef.current;
		const chart = chartApi.getInstance();

		const handleResize = () => {
			if (!root) return;
			chart.applyOptions({
				...chartOption,
				width: root.clientWidth,
				height: root.clientHeight - INTERVAL_SELECTOR_HEIGHT,
			});
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			chartApi.isRemoved = true;
			chart.remove();
		};
	}, [root, chartOption]);

	useLayoutEffect(() => {
		const chartApi = chartApiRef.current;
		chartApi.getInstance();
		if (onChartReady) {
			onChartReady();
		}
	}, [onChartReady]);

	useLayoutEffect(() => {
		if (!chartOption) return;

		const currentRef = chartApiRef.current;
		currentRef.getInstance().applyOptions(chartOption);
	}, [chartOption]);

	useEffect(() => {
		const currentRef = chartApiRef.current;
		currentRef.getInstance().applyOptions({ layout });
	}, [layout]);

	useImperativeHandle(ref, () => chartApiRef.current.getInstance(), []);

	return (
		<ChartContainerContext value={chartApiRef.current}>
			{children}
		</ChartContainerContext>
	);
}

export function useChartContainer() {
	const context = useContext(ChartContainerContext);
	if (!context) {
		throw new Error('useChartContainer must be used within a ChartContainer');
	}
	return context;
}
