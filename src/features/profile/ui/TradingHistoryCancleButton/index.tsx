import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import {
	OrderStatus,
	type TradingHistory,
} from '../../types/tradingHistory.type';

type TradingHistoryCancelButtonProps = {
	status: TradingHistory['orderStatus'];
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function TradingHistoryCancelButton({
	status,
	...props
}: TradingHistoryCancelButtonProps) {
	let text = '';
	switch (status) {
		case OrderStatus.UNSETTLED:
		case OrderStatus.IN_PROGRESS:
			text = '취소';
			break;
		case OrderStatus.SETTLED:
			text = '체결완료';
			break;
	}

	return (
		<button
			type="button"
			className={clsx('cursor-pointer text-red-600', {
				'!disabled !text-gray-700 !cursor-not-allowed':
					status === OrderStatus.SETTLED,
			})}
			{...props}
		>
			{text}
		</button>
	);
}
