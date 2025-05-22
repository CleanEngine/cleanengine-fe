import { formatCurrencyKR } from '~/shared/utils';
import useCurrentPrice from '../../hooks/useCurrentPrice';
import type { CoinInfo } from '../../types/coin.type';

type CoinPriceWithNameProps = CoinInfo & {
	img?: string;
};

export default function CoinPriceWithName({
	name,
	ticker,
	img,
}: CoinPriceWithNameProps) {
	const price = useCurrentPrice(ticker);
	return (
		<div className="flex h-14 items-center gap-4 px-4">
			{img ? <img src={img} alt={name} className="h-6 w-6" /> : <span>🪙</span>}
			<div>
				<div className="flex items-end gap-2">
					<span className="font-semibold text-gray-800 text-md">{name}</span>
					<span className="text-gray-500 text-md">{ticker}</span>
				</div>
				<div>
					<span className="font-semibold text-gray-800 text-lg">
						{price ? formatCurrencyKR(price.currentPrice) : '-'}원
					</span>
				</div>
			</div>
		</div>
	);
}
