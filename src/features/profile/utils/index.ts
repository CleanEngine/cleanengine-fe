import type { CoinPieChartData } from '../types/chart.type';

export function generateCoinPieChartData(
	data: {
		ticker: string;
		size: number;
		buyPrice: number;
	}[],
): CoinPieChartData[] {
	return data
		.map((item) => ({
			ticker: item.ticker,
			totalPrice: item.size * item.buyPrice,
			averagePrice: item.buyPrice,
			quantity: item.size,
		}))
		.sort((a, b) => b.totalPrice - a.totalPrice);
}
