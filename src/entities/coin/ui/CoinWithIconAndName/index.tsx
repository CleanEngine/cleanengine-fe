import type { ReactElement } from 'react';

export type CoinWithIconAndNameProps = {
	coinName: string;
	coinTicker: string;
	CoinIcon: ReactElement;
};

export default function CoinWithIconAndName({
	coinName,
	coinTicker,
	CoinIcon: coinIcon,
}: CoinWithIconAndNameProps) {
	return (
		<div className="flex w-fit flex-col">
			<div className="flex gap-1">
				<span className="inline-block h-fit w-fit overflow-visible">
					{coinIcon}
				</span>
				<span className="font-semibold">{coinTicker}</span>
			</div>
			<span className="px-1.5 text-gray-500 text-xs">{coinName}</span>
		</div>
	);
}
