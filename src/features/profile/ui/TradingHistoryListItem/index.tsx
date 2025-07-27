import { formatDateKr } from '~/features/tradeview/utils';
import { formatCurrencyKR } from '~/shared/utils';
import {
	OrderType,
	Side,
	type TradingHistory,
} from '../../types/tradingHistory.type';
import TradingHistoryCancelButton from '../TradingHistoryCancelButton';

type TradingHistoryListItemProps = TradingHistory;

export default function TradingHistoryListItem({
	tradeTime,
	orderId,
	...props
}: Readonly<TradingHistoryListItemProps>) {
	const { side, ticker, orderStatus, orderType } = props;
	const typeText = side === Side.ASK ? '매도' : '매수';
	const priceText =
		side === Side.ASK && orderType === OrderType.MARKET
			? '시장가 매도'
			: `${formatCurrencyKR(props.price)}원`;
	const sizeText =
		side === Side.BID && orderType === OrderType.MARKET
			? '시장가 매수'
			: `${formatCurrencyKR(props.orderSize)}개`;

	return (
		<li className="flex">
			<span className="flex-1">{typeText}</span>
			<span className="flex-1">{ticker}</span>
			<span className="flex-1">{priceText}</span>
			<span className="flex-1">{sizeText}</span>
			<span className="flex-[2.5]">{formatDateKr(new Date(tradeTime))}</span>
			<div className="flex-1 text-center">
				<TradingHistoryCancelButton status={orderStatus} orderId={orderId} />
			</div>
		</li>
	);
}
