import { formatCurrencyKR } from '~/shared/utils';
import type { TradingHistory } from '../../types/tradingHistory.type';
import TradingHistoryCancelButton from '../TradingHistoryCancleButton';

type TradingHistoryListItemProps = TradingHistory;

export default function TradingHistoryListItem(
	props: Readonly<TradingHistoryListItemProps>,
) {
	const { side, ticker, status, orderType } = props;
	const typeText = side === 'ask' ? '매수' : '매도';
	const priceText =
		side === 'ask' && orderType === 'market'
			? '시장가 매수'
			: `${formatCurrencyKR(props.price)}원`;
	const sizeText =
		side === 'bid' && orderType === 'market'
			? '시장가 매도'
			: `${formatCurrencyKR(props.size)}개`;

	return (
		<li className="flex">
			<span className="flex-1">{typeText}</span>
			<span className="flex-1">{ticker}</span>
			<span className="flex-1">{priceText}</span>
			<span className="flex-1">{sizeText}</span>
			<div className="flex-1 text-center">
				<TradingHistoryCancelButton status={status} />
			</div>
		</li>
	);
}
