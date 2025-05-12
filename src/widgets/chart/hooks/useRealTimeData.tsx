import { useEffect, useState } from 'react';

type RowData = {
	acc_ask_volume: number;
	acc_bid_volume: number;
	acc_trade_price: number;
	acc_trade_price_24h: number;
	acc_trade_volume: number;
	acc_trade_volume_24h: number;
	ask_bid: 'ASK' | 'BID';
	change: 'RISE' | 'FALL' | 'EVEN';
	change_price: number;
	change_rate: number;
	code: string;
	delisting_date: string | null;
	high_price: number;
	highest_52_week_date: string;
	highest_52_week_price: number;
	is_trading_suspended: boolean;
	low_price: number;
	lowest_52_week_date: string;
	lowest_52_week_price: number;
	market_state: 'ACTIVE' | 'INACTIVE';
	market_warning: 'NONE' | string;
	opening_price: number;
	prev_closing_price: number;
	signed_change_price: number;
	signed_change_rate: number;
	stream_type: 'REALTIME';
	timestamp: number;
	trade_date: string;
	trade_price: number;
	trade_time: string;
	trade_timestamp: number;
	trade_volume: number;
	type: 'ticker';
};

export type CandlestickData = {
	Timestamp: number;
	Close: number;
	High: number;
	Low: number;
	Open: number;
	Volume: number;
};

export default function useRealTimeData() {
	const [data, setData] = useState<CandlestickData | null>(null);

	useEffect(() => {
		const websocket = new WebSocket('wss://api.upbit.com/websocket/v1');

		websocket.onopen = () => {
			websocket.send(
				JSON.stringify([
					{ ticket: 'invest-future' },
					{ type: 'ticker', codes: ['KRW-BTC'] },
				]),
			);
		};

		websocket.onmessage = (event: MessageEvent) => {
			const reader = new FileReader();
			reader.onload = () => {
				const data = JSON.parse(reader.result as string) as RowData;
				setData({
					Close: data.trade_price,
					Timestamp: data.trade_timestamp,
					High: data.high_price,
					Low: data.low_price,
					Open: data.opening_price,
					Volume: data.acc_trade_volume,
				});
			};

			reader.readAsText(event.data);
		};
	}, []);

	return data;
}
