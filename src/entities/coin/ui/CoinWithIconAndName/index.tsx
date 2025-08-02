import { convertBase64ToSvg } from '~/shared/utils';
import type { CoinInfo } from '../../types/coin.type';

export type CoinWithIconAndNameProps = Omit<
	CoinInfo,
	'changeRate' | 'currentPrice'
>;

export default function CoinWithIconAndName({
	name,
	ticker,
	svgIconBase64,
}: CoinWithIconAndNameProps) {
	return (
		<div className="flex w-fit flex-col" data-testid="coin-with-icon-and-name">
			<div className="flex gap-1">
				<span className="inline-block h-fit w-fit overflow-visible">
					{svgIconBase64 ? (
						<img
							src={convertBase64ToSvg(svgIconBase64)}
							alt={name}
							className="h-6 w-6"
						/>
					) : (
						'🪙'
					)}
				</span>
				<span className="font-semibold">{ticker}</span>
			</div>
			<span className="px-1.5 text-gray-500 text-xs">{name}</span>
		</div>
	);
}
