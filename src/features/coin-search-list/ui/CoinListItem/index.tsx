import { Link, type LinkProps } from 'react-router';

import {
	CoinWithIconAndName,
	type CoinWithIconAndNameProps,
} from '~/entities/coin';

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

	return (
		<Link to={to} className="block">
			<button
				type="button"
				className="flex w-[clamp(200px,100%,320px)] items-center"
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
