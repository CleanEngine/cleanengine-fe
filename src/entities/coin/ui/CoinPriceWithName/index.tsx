import { formatCurrencyKR } from '~/shared/utils';
import useCurrentPrice from '../../hooks/useCurrentPrice';
import type { CoinInfo } from '../../types/coin.type';

type CoinPriceWithNameProps = Omit<CoinInfo, 'changeRate'>;

export default function CoinPriceWithName({
	name,
	ticker,
	currentPrice: lastPrice,
	svgIconBase64,
}: CoinPriceWithNameProps) {
	const realtimePriceData = useCurrentPrice(ticker);
	const displayPrice = realtimePriceData
		? realtimePriceData.currentPrice
		: lastPrice || 0;

	return (
		<div className="flex h-14 items-center gap-4 px-4">
			{svgIconBase64 ? (
				<img src={svgIconBase64} alt={name} className="h-6 w-6" />
			) : (
				<span>🪙</span>
			)}
			<div>
				<div className="flex items-end gap-2">
					<span className="font-semibold text-gray-800 text-md">{name}</span>
					<span className="text-gray-500 text-md">{ticker}</span>
				</div>
				<div>
					<span className="font-semibold text-gray-800 text-lg">
						{formatCurrencyKR(displayPrice)}원
					</span>
				</div>
			</div>
		</div>
	);
}
