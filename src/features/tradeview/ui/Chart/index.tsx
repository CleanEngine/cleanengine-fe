import type { CandlestickData } from '../../types/tradeview.type';
import ChartContainer from './ChartContainer';
import MainPanel from './MainPanel';
import SbDateAxis from './SbDateAxis';
import SbSeries from './SbSeries';
import SbValueAxis from './SbValueAxis';
import StockChart from './StockChart';
import StockToolBar from './StockToolBar';
import ValueSeries from './ValueSeries';
import XScrollBar from './XScrollBar';

// 지난 30일간의 더미 캔들스틱 데이터 생성
const DUMMY_DATA: CandlestickData[] = (() => {
	const data: CandlestickData[] = [];
	const now = new Date();
	const basePrice = 50000; // 기준 가격
	const baseVolume = 10000; // 기준 거래량

	// 지난 30일간의 일봉 데이터 (30개)
	for (let i = 29; i >= 0; i--) {
		const date = new Date();
		date.setDate(now.getDate() - i);

		// 랜덤 변동폭 (전날 종가의 -5%~5%)
		const changePercent = (Math.random() * 10 - 5) / 100;

		// 시가는 전일 종가에서 시작
		const open = data.length ? data[data.length - 1].Close : basePrice;

		// 종가는 시가에서 랜덤 변동
		const close = open * (1 + changePercent);

		// 고가는 시가와 종가 중 큰 값보다 0-2% 높게
		const highBaseValue = Math.max(open, close);
		const high = highBaseValue * (1 + Math.random() * 0.02);

		// 저가는 시가와 종가 중 작은 값보다 0-2% 낮게
		const lowBaseValue = Math.min(open, close);
		const low = lowBaseValue * (1 - Math.random() * 0.02);

		// 거래량은 기준 거래량의 50-150%
		const volume = baseVolume * (0.5 + Math.random());

		// 각 일자별 24시간 단위 타임스탬프 (ms)
		const timestamp = date.getTime();

		data.push({
			Timestamp: timestamp,
			Open: Number(open.toFixed(2)),
			Close: Number(close.toFixed(2)),
			High: Number(high.toFixed(2)),
			Low: Number(low.toFixed(2)),
			Volume: Math.round(volume),
		});
	}

	return data;
})();

export default function Chart() {
	return (
		<ChartContainer containerId="chartdiv" toolbarId="chart-toolbar">
			<StockChart>
				<MainPanel>
					<XScrollBar>
						<SbSeries pastTimeData={DUMMY_DATA}>
							<SbValueAxis />
							<SbDateAxis />
						</SbSeries>
					</XScrollBar>
					<StockToolBar />
					<ValueSeries pastTimeData={DUMMY_DATA} />
				</MainPanel>
			</StockChart>
		</ChartContainer>
	);
}
