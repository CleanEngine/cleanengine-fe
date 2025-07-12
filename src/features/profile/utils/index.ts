import type { Wallet } from '~/entities/user';
import type { CoinPieChartData } from '../types/chart.type';

export function generateCoinPieChartData(data: Wallet[]): CoinPieChartData[] {
	return data
		.map((item) => ({
			name: item.name,
			ticker: item.ticker,
			accountId: item.accountId,
			totalPrice: item.size * item.buyPrice,
			averagePrice: item.buyPrice,
			quantity: item.size,
			roi: item.roi,
			currentPrice: item.currentPrice,
		}))
		.sort((a, b) => b.totalPrice - a.totalPrice);
}
