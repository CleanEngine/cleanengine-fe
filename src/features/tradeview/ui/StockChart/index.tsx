import * as am5 from '@amcharts/amcharts5';
import * as am5stock from '@amcharts/amcharts5/stock';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useEffect, useLayoutEffect, useRef } from 'react';
import usePastTimeData from '../../hooks/usePastTimeData';
import useRealTimeData, {
	type CandlestickData,
} from '../../hooks/useRealTimeData';

// 시리즈 설정을 추출하는 함수
function getNewSettings<
	T extends am5xy.XYSeries,
	K extends keyof T['_settings'],
>(series: T): Pick<T['_settings'], K> {
	const settingsToCopy: K[] = [
		'name',
		'valueYField',
		'highValueYField',
		'lowValueYField',
		'openValueYField',
		'calculateAggregates',
		'valueXField',
		'xAxis',
		'yAxis',
		'legendValueText',
		'legendRangeValueText',
		'stroke',
		'fill',
	] as K[];

	const newSettings: Partial<Pick<T['_settings'], K>> = {};

	am5.array.each(settingsToCopy, (setting) => {
		const value = series.get(setting);
		if (value !== undefined) {
			newSettings[setting] = value;
		}
	});

	return newSettings as Pick<T['_settings'], K>;
}
// 차트에 이벤트 마커를 생성하는 함수
function makeEvent(
	root: am5.Root,
	dateAxis: am5xy.DateAxis<am5xy.AxisRenderer>,
	date: number,
	letter: string,
	color: am5.Color,
	description: string,
) {
	const dataItem = dateAxis.createAxisRange(
		dateAxis.makeDataItem({ value: date }),
	);
	const grid = dataItem.get('grid');
	if (grid) {
		grid.setAll({
			visible: true,
			strokeOpacity: 0.2,
			strokeDasharray: [3, 3],
		});
	}

	const bullet = am5.Container.new(root, {
		dy: -100,
	});

	const circle = bullet.children.push(
		am5.Circle.new(root, {
			radius: 10,
			stroke: color,
			fill: am5.color(0xffffff),
			tooltipText: description,
			tooltip: am5.Tooltip.new(root, {}),
			tooltipY: 0,
		}),
	);

	const label = bullet.children.push(
		am5.Label.new(root, {
			text: letter,
			centerX: am5.p50,
			centerY: am5.p50,
		}),
	);

	dataItem.set(
		'bullet',
		am5xy.AxisBullet.new(root, {
			location: 0,
			stacked: true,
			sprite: bullet,
		}),
	);
}

export default function StockChart() {
	const chartControlRef = useRef<HTMLDivElement>(null);
	const valueSeriesRef = useRef<am5xy.CandlestickSeries>(null);
	const sbSeriesRef = useRef<am5xy.LineSeries>(null);
	const currentValueDataRef = useRef<am5.DataItem<am5xy.IAxisDataItem>>(null);
	const isFirstRendered = useRef(true);
	const realTimeData = useRealTimeData();
	const pastTimeData = usePastTimeData();
	const rootRef = useRef<am5.Root>(null);
	const stockChartRef = useRef<am5stock.StockChart>(null);

	useEffect(() => {
		if (!valueSeriesRef.current || !sbSeriesRef.current || !realTimeData)
			return;

		if (isFirstRendered.current) {
			valueSeriesRef.current.data.setAll(pastTimeData);
			sbSeriesRef.current.data.setAll(pastTimeData);
			isFirstRendered.current = false;
			return;
		}

		const lastDataObject = valueSeriesRef.current.data.values.at(
			-1,
		) as CandlestickData;

		if (!lastDataObject) {
			valueSeriesRef.current.data.push(realTimeData);
			sbSeriesRef.current.data.push(realTimeData);
			return;
		}

		const {
			Close,
			High,
			Low,
			Open,
			Volume,
			Timestamp: PrevTimestamp,
		} = lastDataObject;
		const {
			Close: CurrentClose,
			Volume: CurrentVolume,
			Timestamp: CurrentTimestamp,
		} = realTimeData;

		if (am5.time.checkChange(CurrentTimestamp, PrevTimestamp, 'minute')) {
			// 새로운 분봉 시작
			const newCandlestickData = {
				Open: CurrentClose,
				High: CurrentClose,
				Low: CurrentClose,
				Close: CurrentClose,
				Volume: CurrentVolume,
				Timestamp: CurrentTimestamp,
			};
			valueSeriesRef.current.data.push(newCandlestickData);
			sbSeriesRef.current.data.push(newCandlestickData);
		} else {
			// 기존 분봉 업데이트
			const newCandlestickData = {
				Open: Open,
				High: Math.max(High, CurrentClose),
				Low: Math.min(Low, CurrentClose),
				Close: CurrentClose,
				Volume: Volume + CurrentVolume,
				Timestamp: CurrentTimestamp,
			};
			valueSeriesRef.current.data.setIndex(
				valueSeriesRef.current.data.length - 1,
				newCandlestickData,
			);
			sbSeriesRef.current.data.setIndex(
				sbSeriesRef.current.data.length - 1,
				newCandlestickData,
			);
		}

		if (!currentValueDataRef.current) return;

		const currentLabel = currentValueDataRef.current.get('label');
		if (currentLabel) {
			currentValueDataRef.current.animate({
				key: 'value',
				to: realTimeData.Close,
				duration: 500,
				easing: am5.ease.out(am5.ease.cubic),
			});
			currentLabel.set(
				'text',
				stockChartRef.current?.getNumberFormatter().format(realTimeData.Close),
			);
			const bg = currentLabel.get('background');
			if (bg) {
				if (realTimeData.Close < realTimeData.Open) {
					bg.set('fill', rootRef.current?.interfaceColors.get('negative'));
				} else {
					bg.set('fill', rootRef.current?.interfaceColors.get('positive'));
				}
			}
		}
	}, [realTimeData, pastTimeData]);

	useLayoutEffect(() => {
		// 루트 요소 생성
		rootRef.current = am5.Root.new('chartdiv');
		if (!rootRef.current) return;

		const myTheme = am5.Theme.new(rootRef.current);

		myTheme.rule('Grid', ['scrollbar', 'minor']).setAll({
			visible: false,
		});

		rootRef.current.setThemes([
			am5themes_Animated.new(rootRef.current),
			myTheme,
		]);

		// 스톡 차트 생성
		stockChartRef.current = rootRef.current.container.children.push(
			am5stock.StockChart.new(rootRef.current, {
				paddingRight: 0,
			}),
		);

		// 전역 숫자 포맷 설정
		rootRef.current.numberFormatter.set('numberFormat', '#,###.00');

		// 메인 스톡 패널(차트) 생성
		const mainPanel = stockChartRef.current?.panels.push(
			am5stock.StockPanel.new(rootRef.current, {
				wheelY: 'zoomX',
				panX: true,
				panY: true,
			}),
		);

		// 값 축 생성
		const valueAxis = mainPanel.yAxes.push(
			am5xy.ValueAxis.new(rootRef.current, {
				renderer: am5xy.AxisRendererY.new(rootRef.current, {
					pan: 'zoom',
				}),
				extraMin: 0.1, // adds some space for for main series
				tooltip: am5.Tooltip.new(rootRef.current, {}),
				numberFormat: '#,###.00',
				extraTooltipPrecision: 2,
			}),
		);

		const dateAxis = mainPanel.xAxes.push(
			am5xy.GaplessDateAxis.new(rootRef.current, {
				baseInterval: {
					timeUnit: 'minute',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(rootRef.current, {
					minorGridEnabled: true,
				}),
				tooltip: am5.Tooltip.new(rootRef.current, {}),
			}),
		);

		// 시리즈 추가
		valueSeriesRef.current = mainPanel.series.push(
			am5xy.CandlestickSeries.new(rootRef.current, {
				name: 'MSFT',
				clustered: false,
				valueXField: 'Timestamp',
				valueYField: 'Close',
				highValueYField: 'High',
				lowValueYField: 'Low',
				openValueYField: 'Open',
				calculateAggregates: true,
				xAxis: dateAxis,
				yAxis: valueAxis,
				legendValueText:
					'open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]',
				legendRangeValueText: '',
			}),
		);

		// 메인 값 시리즈 설정
		stockChartRef.current?.set('stockSeries', valueSeriesRef.current);

		currentValueDataRef.current = valueAxis.createAxisRange(
			valueAxis.makeDataItem({ value: 0 }),
		);

		// 스톡 범례 추가
		const valueLegend = mainPanel.plotContainer.children.push(
			am5stock.StockLegend.new(rootRef.current, {
				stockChart: stockChartRef.current,
			}),
		);

		// 메인 시리즈 설정
		valueLegend.data.setAll([valueSeriesRef.current]);

		// 커서 추가
		mainPanel.set(
			'cursor',
			am5xy.XYCursor.new(rootRef.current, {
				yAxis: valueAxis,
				xAxis: dateAxis,
				snapToSeries: [valueSeriesRef.current],
				snapToSeriesBy: 'y!',
			}),
		);

		// 스크롤바 추가
		const scrollbar = mainPanel.set(
			'scrollbarX',
			am5xy.XYChartScrollbar.new(rootRef.current, {
				orientation: 'horizontal',
				height: 50,
			}),
		);
		stockChartRef.current?.toolsContainer.children.push(scrollbar);

		const sbDateAxis = scrollbar.chart.xAxes.push(
			am5xy.GaplessDateAxis.new(rootRef.current, {
				baseInterval: {
					timeUnit: 'minute',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(rootRef.current, {
					minorGridEnabled: true,
				}),
			}),
		);

		const sbValueAxis = scrollbar.chart.yAxes.push(
			am5xy.ValueAxis.new(rootRef.current, {
				renderer: am5xy.AxisRendererY.new(rootRef.current, {}),
			}),
		);

		sbSeriesRef.current = scrollbar.chart.series.push(
			am5xy.LineSeries.new(rootRef.current, {
				valueYField: 'Close',
				valueXField: 'Timestamp',
				xAxis: sbDateAxis,
				yAxis: sbValueAxis,
			}),
		);

		sbSeriesRef.current?.fills.template.setAll({
			visible: true,
			fillOpacity: 0.3,
		});

		// 시리즈 타입 스위처
		const seriesSwitcher = am5stock.SeriesTypeControl.new(rootRef.current, {
			stockChart: stockChartRef.current,
		});

		seriesSwitcher.events.on('selected', (ev) => {
			// Handle the case where item can be string or IDropdownListItem
			const itemValue = typeof ev.item === 'string' ? ev.item : ev.item.id;
			setSeriesType(itemValue);
		});

		// 시리즈 타입을 전환하는 함수
		const setSeriesType = (seriesType: string) => {
			if (!rootRef.current || !stockChartRef.current) return;
			// 현재 시리즈와 설정 가져오기
			const currentSeries = stockChartRef.current.get('stockSeries');
			if (!currentSeries) return;

			const newSettings = getNewSettings(currentSeries);

			// 이전 시리즈 제거
			const data = currentSeries.data.values;
			mainPanel.series.removeValue(currentSeries);

			// 새 시리즈 생성
			let series: am5xy.LineSeries | am5xy.CandlestickSeries | am5xy.OHLCSeries;
			switch (seriesType) {
				case 'line':
					series = mainPanel.series.push(
						am5xy.LineSeries.new(rootRef.current, newSettings),
					);
					break;
				case 'candlestick':
				case 'procandlestick':
					// newSettings.clustered = false;
					series = mainPanel.series.push(
						am5xy.CandlestickSeries.new(rootRef.current, newSettings),
					);
					if (seriesType === 'procandlestick') {
						series?.columns?.template?.get('themeTags')?.push('pro');
					}
					break;
				case 'ohlc':
					// newSettings.clustered = false;
					series = mainPanel.series.push(
						am5xy.OHLCSeries.new(rootRef.current, newSettings),
					);
					break;
			}

			// 새 시리즈를 stockSeries로 설정
			if (series) {
				valueLegend.data.removeValue(currentSeries);
				series.data.setAll(data);
				stockChartRef.current?.set('stockSeries', series);
				const cursor = mainPanel.get('cursor');
				if (cursor) {
					cursor.set('snapToSeries', [series]);
				}
				valueLegend.data.insertIndex(0, series);
			}
		};

		// 스톡 툴바
		const toolbar = am5stock.StockToolbar.new(rootRef.current, {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			container: chartControlRef.current!,
			stockChart: stockChartRef.current,
			controls: [
				am5stock.IndicatorControl.new(rootRef.current, {
					stockChart: stockChartRef.current,
					legend: valueLegend,
				}),
				am5stock.DateRangeSelector.new(rootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.PeriodSelector.new(rootRef.current, {
					stockChart: stockChartRef.current,
				}),
				seriesSwitcher,
				am5stock.DrawingControl.new(rootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.DataSaveControl.new(rootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.ResetControl.new(rootRef.current, {
					stockChart: stockChartRef.current,
				}),
				am5stock.SettingsControl.new(rootRef.current, {
					stockChart: stockChartRef.current,
				}),
			],
		});

		// 추가 데이터 샘플로 계속할 수 있습니다

		// 사용자 정의 툴팁 생성
		const tooltip = am5.Tooltip.new(rootRef.current, {
			getStrokeFromSprite: false,
			getFillFromSprite: false,
		});

		tooltip.get('background')?.setAll({
			strokeOpacity: 1,
			stroke: am5.color(0x000000),
			fillOpacity: 1,
			fill: am5.color(0xffffff),
		});

		// 차트에 이벤트 추가
		makeEvent(
			rootRef.current,
			dateAxis,
			1619006400000,
			'S',
			am5.color(0xff0000),
			'Split 4:1',
		);
		makeEvent(
			rootRef.current,
			dateAxis,
			1619006400000,
			'D',
			am5.color(0x00ff00),
			'Dividends paid',
		);
		makeEvent(
			rootRef.current,
			dateAxis,
			1634212800000,
			'D',
			am5.color(0x00ff00),
			'Dividends paid',
		);

		// 컴포넌트 언마운트시 차트 정리
		return () => {
			rootRef.current?.dispose();
		};
	}, []);

	return (
		<div className="flex h-full w-full flex-col">
			<div ref={chartControlRef} />
			<div id="chartdiv" className="flex-1" />
		</div>
	);
}
