import { type LinkProps, useNavigate } from 'react-router';

import {
	type CoinInfo,
	CoinWithIconAndName,
	useCurrentPrice,
} from '~/entities/coin';
import { formatCurrencyKR } from '~/shared/utils';

export type CoinListItemProps = {
	to: LinkProps['to'];
	onClick?: () => void;
} & CoinInfo;

export default function CoinListItem({
	name,
	ticker,
	svgIconBase64,
	currentPrice: lastPrice,
	changeRate,
	to,
	onClick,
}: Readonly<CoinListItemProps>) {
	const navigate = useNavigate();
	const currentPriceData = useCurrentPrice(ticker);
	const displayPrice = currentPriceData
		? currentPriceData.currentPrice
		: lastPrice || 0;
	const displayChangeRate = currentPriceData
		? currentPriceData.changeRate
		: changeRate || 0;
	const isBull = displayChangeRate > 0;

	const handleClickCoinItem = async () => {
		onClick?.();
		await navigate(to);
	};

	return (
		<button
			type="button"
			className="flex w-[max(300px,100%)] cursor-pointer items-center py-1"
			onClick={handleClickCoinItem}
		>
			<div className="flex-1">
				<CoinWithIconAndName
					name={name}
					ticker={ticker}
					svgIconBase64={svgIconBase64}
				/>
			</div>
			<div className="flex-1 text-right text-sm">
				<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
					{formatCurrencyKR(Number(displayPrice.toFixed(2)))}원
				</span>
			</div>
			<div className="flex-1 text-right text-sm">
				<span className={isBull ? 'text-red-600' : 'text-blue-700'}>
					{displayChangeRate.toFixed(2)}%
				</span>
			</div>
			<div className="flex-1 text-right text-sm">
				{/* TODO: 거래량 API가 나오면 추가할 것 */}
				<span>{0}</span>
			</div>
		</button>
	);
}
