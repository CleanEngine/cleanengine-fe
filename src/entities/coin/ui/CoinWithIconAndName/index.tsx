import type { ReactElement } from 'react';
import type { CoinInfo } from '../../types/coin.type';

export type CoinWithIconAndNameProps = {
	coinIcon: ReactElement;
} & CoinInfo;

export default function CoinWithIconAndName({
	name,
	ticker,
	coinIcon,
}: CoinWithIconAndNameProps) {
	return (
		<div className="flex w-fit flex-col" data-testid="coin-with-icon-and-name">
			<div className="flex gap-1">
				<span className="inline-block h-fit w-fit overflow-visible">
					{coinIcon}
				</span>
				<span className="font-semibold">{ticker}</span>
			</div>
			<span className="px-1.5 text-gray-500 text-xs">{name}</span>
		</div>
	);
}
