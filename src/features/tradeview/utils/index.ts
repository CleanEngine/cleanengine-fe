import type { IDisposer } from '@amcharts/amcharts5';
import { toZonedTime } from 'date-fns-tz';
import type { UTCTimestamp } from 'lightweight-charts';
import type { CandlestickData, RawData } from '../types/tradeview.type';

export function isDisposed(...amchartElements: IDisposer[]) {
	return amchartElements.every((amchartElement) => amchartElement.isDisposed());
}

export function extractCandlestickData(data: RawData[]): CandlestickData[] {
	return data.map((item) => ({
		time: timeToKrTz(item.timestamp, 'Asia/Seoul') as UTCTimestamp,
		open: Number(item.open),
		high: Number(item.high),
		low: Number(item.low),
		close: Number(item.close),
	}));
}

export function timeToKrTz(originalTime: string, timeZone: string) {
	const date = new Date(originalTime);
	date.setHours(date.getHours() + 9);

	const zonedDate = toZonedTime(date, timeZone);
	return zonedDate.getTime() / 1000;
}

export function timestampToISOString(timestamp: number) {
	const date = new Date(timestamp * 1000);
	return date.toISOString().slice(0, -1);
}
