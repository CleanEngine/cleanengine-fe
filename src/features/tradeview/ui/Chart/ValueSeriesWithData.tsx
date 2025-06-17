import { useCallback, useState } from 'react';
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

export default function ValueSeriesWithData(props: ValueSeriesProps) {
	const [data, setData] = useState<CandlestickData[]>(DUMMY_DATA);

	const fetchPastTimeData = useCallback(async () => {
		setData((prevData) => {
			if (prevData.length === 0) return prevData;

			// 기존 데이터의 가장 오래된 타임스탬프와 가격을 기준으로 함
			const oldestData = prevData[0];
			const oldestTimestamp = oldestData.Timestamp;
			const basePrice = oldestData.Open;
			const baseVolume = 1000;

			const pastData: CandlestickData[] = [];

			// 100개의 1분봉 데이터를 가장 오래된 데이터보다 이전 시간으로 생성
			for (let i = 10; i >= 1; i--) {
				const date = new Date(oldestTimestamp);
				date.setMinutes(date.getMinutes() - i);

				// 이전 봉의 종가를 기준으로 랜덤 변동 (-1% ~ +1%)
				const changePercent = (Math.random() * 2 - 1) / 100;
				const prevClose = pastData.length
					? pastData[pastData.length - 1].Close
					: basePrice;

				const open = prevClose;
				const close = open * (1 + changePercent);

				// 고가는 시가와 종가 중 큰 값보다 0-1% 높게
				const highBaseValue = Math.max(open, close);
				const high = highBaseValue * (1 + Math.random() * 0.01);

				// 저가는 시가와 종가 중 작은 값보다 0-1% 낮게
				const lowBaseValue = Math.min(open, close);
				const low = lowBaseValue * (1 - Math.random() * 0.01);

				// 거래량 (기준 거래량의 30-200%)
				const volume = baseVolume * (0.3 + Math.random() * 1.7);

				pastData.push({
					Timestamp: date.getTime(),
					Open: Number(open.toFixed(2)),
					Close: Number(close.toFixed(2)),
					High: Number(high.toFixed(2)),
					Low: Number(low.toFixed(2)),
					Volume: Math.round(volume),
				});
			}

			// 새로운 과거 데이터를 기존 데이터 앞에 추가
			return [...pastData, ...prevData];
		});
	}, []);

	return (
		<ValueSeries
			{...props}
			pastTimeData={data}
			fetchPastTimeData={fetchPastTimeData}
		/>
	);
}
