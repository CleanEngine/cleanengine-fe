import { Link, type LinkProps } from 'react-router';

import {
	CoinWithIconAndName,
	type CoinWithIconAndNameProps,
	useCurrentPrice,
} from '~/entities/coin';

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
	const sign = isBull ? '+' : '-';

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
						{currentPriceData?.currentPrice}
					</span>
				</div>
				<div className="flex-1 text-right text-sm">
					<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
						{sign}
						{currentPriceData?.changeRate}%
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
