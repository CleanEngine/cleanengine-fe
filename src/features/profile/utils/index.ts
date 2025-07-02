import type { CoinPieChartData } from '../types/chart.type';

export function generateCoinPieChartData(
	data: {
		ticker: string;
		size: number;
		price: number;
	}[],
): CoinPieChartData[] {
	return data
		.map((item) => ({
			ticker: item.ticker,
			totalPrice: item.size * item.price,
			averagePrice: item.price,
			quantity: item.size,
		}))
		.sort((a, b) => b.totalPrice - a.totalPrice);
}
