import { Link, type LinkProps } from 'react-router';

import {
	CoinWithIconAndName,
	type CoinWithIconAndNameProps,
} from '~/entities/coin';
import useRealTimePrice from '~/entities/coin/hooks/useRealTimePrice';

export type CoinListItemProps = {
	to: LinkProps['to'];
	price: number;
	fluctuationRate: number;
	transactionAmount: number;
} & CoinWithIconAndNameProps;

export default function CoinListItem({
	price,
	fluctuationRate,
	transactionAmount,
	coinName,
	coinTicker,
	CoinIcon,
	to,
}: CoinListItemProps) {
	const isBull = fluctuationRate > 0;
	const sign = isBull ? '+' : '-';
	useRealTimePrice();

	return (
		<Link to={to} className="block px-2">
			<button
				type="button"
				className="flex w-[max(320px,100%)] cursor-pointer items-center py-1"
			>
				<div className="flex-1">
					<CoinWithIconAndName
						coinName={coinName}
						coinTicker={coinTicker}
						CoinIcon={CoinIcon}
					/>
				</div>
				<div className="flex-1 text-right text-sm">
					<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
						{price}
					</span>
				</div>
				<div className="flex-1 text-right text-sm">
					<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
						{sign}
						{fluctuationRate}%
					</span>
				</div>
				<div className="flex-1 text-right text-sm">
					<span>{transactionAmount}</span>
				</div>
			</button>
		</Link>
	);
}
