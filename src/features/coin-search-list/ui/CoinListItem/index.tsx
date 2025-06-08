import { Link, type LinkProps } from 'react-router';

import {
	CoinWithIconAndName,
	type CoinWithIconAndNameProps,
	useCurrentPrice,
} from '~/entities/coin';
import { formatCurrencyKR } from '~/shared/utils';

export type CoinListItemProps = {
	to: LinkProps['to'];
} & CoinWithIconAndNameProps;

export default function CoinListItem({
	name,
	ticker,
	coinIcon: CoinIcon,
	to,
}: CoinListItemProps) {
	const currentPriceData = useCurrentPrice(ticker);
	const isBull = currentPriceData && currentPriceData.changeRate > 0;
	const formatedPrice = `${formatCurrencyKR(+(currentPriceData?.currentPrice || 0).toFixed(2))}원`;

	return (
		<Link to={to} className="block px-2">
			<button
				type="button"
				className="flex w-[max(300px,100%)] cursor-pointer items-center py-1"
			>
				<div className="flex-1">
					<CoinWithIconAndName
						name={name}
						ticker={ticker}
						coinIcon={CoinIcon}
					/>
				</div>
				<div className="flex-1 text-right text-sm">
					<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
						{formatedPrice}
					</span>
				</div>
				<div className="flex-1 text-right text-sm">
					<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
						{(currentPriceData?.changeRate || 0).toFixed(2)}%
					</span>
				</div>
				<div className="flex-1 text-right text-sm">
					{/* TODO: 거래량 API가 나오면 추가할 것 */}
					<span>{0}</span>
				</div>
			</button>
		</Link>
	);
}
