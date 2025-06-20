import {
	AreaSeries,
	BarSeries,
	CandlestickSeries,
	HistogramSeries,
	type ISeriesApi,
	LineSeries,
	type SeriesDataItemTypeMap,
	type SeriesOptionsMap,
	type SeriesType,
} from 'lightweight-charts';
import {
	type PropsWithChildren,
	createContext,
	useContext,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from 'react';

import { useChartContainer } from './ChartContainer';

type SeriesApi<T extends SeriesType> = {
	_instance: ISeriesApi<T> | null;
	getInstance(): ISeriesApi<T>;
	free(): void;
};

type SeriesProps<T extends SeriesType> = PropsWithChildren<{
	seriesType: T;
	seriesOption?: SeriesOptionsMap[T];
	ref?: React.RefObject<ISeriesApi<T> | null>;
	data?: SeriesDataItemTypeMap[T][];
}>;

const SeriesContext = createContext<SeriesApi<SeriesType> | null>(null);

export default function Series<T extends SeriesType>({
	seriesType,
	children,
	seriesOption,
	data,
	ref,
}: SeriesProps<T>) {
	const parent = useChartContainer();
	const seriesApiRef = useRef<SeriesApi<T>>({
		_instance: null,

		getInstance() {
			if (!parent) {
				throw new Error('Series should be used within ChartContainer');
			}

			if (!this._instance) {
				switch (seriesType) {
					case 'Area':
						this._instance = parent
							.getInstance()
							.addSeries(AreaSeries, seriesOption) as ISeriesApi<T>;
						break;
					case 'Bar':
						this._instance = parent
							.getInstance()
							.addSeries(BarSeries, seriesOption) as ISeriesApi<T>;
						break;
					case 'Line':
						this._instance = parent
							.getInstance()
							.addSeries(LineSeries, seriesOption) as ISeriesApi<T>;
						break;
					case 'Histogram':
						this._instance = parent
							.getInstance()
							.addSeries(HistogramSeries, seriesOption) as ISeriesApi<T>;
						break;
					case 'Candlestick':
						this._instance = parent
							.getInstance()
							.addSeries(CandlestickSeries, seriesOption) as ISeriesApi<T>;
						break;
					default:
						throw new Error('Invalid series type');
				}

				if (data) {
					this._instance.setData(data);
				}
			}

			return this._instance;
		},

		free() {
			if (!this._instance || parent.isRemoved) return;

			parent.free(this._instance);
		},
	});

	useLayoutEffect(() => {
		const currentRef = seriesApiRef.current;
		currentRef.getInstance();

		return () => currentRef.free();
	}, []);

	useLayoutEffect(() => {
		if (!seriesOption) return;

		const currentRef = seriesApiRef.current;
		currentRef.getInstance().applyOptions(seriesOption);
	}, [seriesOption]);

	useImperativeHandle(ref, () => seriesApiRef.current.getInstance(), []);

	return (
		<SeriesContext.Provider value={seriesApiRef.current}>
			{children}
		</SeriesContext.Provider>
	);
}

export function useSeries() {
	const context = useContext(SeriesContext);
	if (!context) {
		throw new Error('useSeries must be used within a Series');
	}
	return context;
}
