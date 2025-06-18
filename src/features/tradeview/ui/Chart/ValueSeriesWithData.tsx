import type { CandlestickData } from '../../types/tradeview.type';
import ValueSeries, { type ValueSeriesProps } from './ValueSeries';

const DUMMY_DATA: CandlestickData[] = (() => {
	const data: CandlestickData[] = [];
	const now = new Date();
	const basePrice = 50000; // 기준 가격
	const baseVolume = 1000; // 기준 거래량

	// 최근 2시간 (120분)의 분봉 데이터
	for (let i = 119; i >= 0; i--) {
		const date = new Date();
		date.setMinutes(now.getMinutes() - i);

		// 랜덤 변동폭 (이전 봉 종가의 -0.5%~0.5%)
		const changePercent = (Math.random() * 1 - 0.5) / 100;

		// 시가는 이전 봉 종가에서 시작
		const open = data.length ? data[data.length - 1].Close : basePrice;

		// 종가는 시가에서 랜덤 변동
		const close = open * (1 + changePercent);

		// 고가는 시가와 종가 중 큰 값보다 0-0.5% 높게
		const highBaseValue = Math.max(open, close);
		const high = highBaseValue * (1 + Math.random() * 0.005);

		// 저가는 시가와 종가 중 작은 값보다 0-0.5% 낮게
		const lowBaseValue = Math.min(open, close);
		const low = lowBaseValue * (1 - Math.random() * 0.005);

		// 거래량은 기준 거래량의 50-150%, 분봉이므로 일봉보다 적게
		const volume = baseVolume * (0.5 + Math.random());

		// 각 분 단위 타임스탬프 (ms)
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

const fetchPastTimeData = (prevData: CandlestickData) => {
	const pastData: CandlestickData[] = [];

	// 시작점은 주어진 데이터
	let currentClose = prevData.Close;
	const baseVolume = prevData.Volume;
	const baseTimestamp = prevData.Timestamp;

	// 10개의 과거 데이터를 생성 (시간 역순으로)
	for (let i = 10; i >= 1; i--) {
		// 1분씩 과거로 이동 (새로운 Date 객체 생성)
		const pastTimestamp = baseTimestamp - i * 60 * 1000; // i분 전

		// 이전 봉의 종가를 기준으로 시가 생성 (작은 갭 허용)
		const gapPercent = (Math.random() * 0.4 - 0.2) / 100; // -0.2% ~ +0.2%
		const open = currentClose * (1 + gapPercent);

		// 종가 생성 (-2% ~ +2% 변동)
		const changePercent = (Math.random() * 4 - 2) / 100;
		const close = open * (1 + changePercent);

		// 고가와 저가 생성
		const maxPrice = Math.max(open, close);
		const minPrice = Math.min(open, close);

		// 고가: 시가/종가 중 높은 값보다 0~2% 높게
		const high = maxPrice * (1 + Math.random() * 0.02);

		// 저가: 시가/종가 중 낮은 값보다 0~2% 낮게
		const low = minPrice * (1 - Math.random() * 0.02);

		// 거래량 (기준의 50~150%)
		const volume = baseVolume * (0.5 + Math.random());

		const candlestick: CandlestickData = {
			Timestamp: pastTimestamp,
			Open: Number(open.toFixed(2)),
			Close: Number(close.toFixed(2)),
			High: Number(high.toFixed(2)),
			Low: Number(low.toFixed(2)),
			Volume: Math.round(volume),
		};

		pastData.push(candlestick);

		// 다음 반복을 위해 현재 종가를 다음 봉의 기준으로 설정
		currentClose = close;
	}

	// 시간순으로 정렬 (과거 -> 현재)
	return pastData.sort((a, b) => a.Timestamp - b.Timestamp);
};

export default function ValueSeriesWithData(props: ValueSeriesProps) {
	return (
		<ValueSeries
			{...props}
			pastTimeData={DUMMY_DATA}
			fetchPastTimeData={fetchPastTimeData}
		/>
	);
}
