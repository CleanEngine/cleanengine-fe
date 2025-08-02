import type { UserInfoResponseData } from '~/entities/user';
import type { CoinPieChartData } from '../types/chart.type';

export function generateCoinPieChartData(
	data: UserInfoResponseData,
): CoinPieChartData[] {
	const pieChartData = data.wallets
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

	pieChartData.push({
		name: '원화',
		ticker: 'KRW',
		accountId: 0,
		totalPrice: data.cash,
		averagePrice: data.cash,
		quantity: 0,
		roi: 0,
		currentPrice: data.cash,
	});

	return pieChartData;
}
