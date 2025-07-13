import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import type { TradingHistory } from '../../types/tradingHistory.type';

type TradingHistoryCancelButtonProps = {
	status: TradingHistory['status'];
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function TradingHistoryCancelButton({
	status,
	...props
}: TradingHistoryCancelButtonProps) {
	let text = '';
	switch (status) {
		case 'unsettled':
			text = '취소';
			break;
		case 'settled':
			text = '체결완료';
			break;
		case 'in_progress':
			text = '체결중';
			break;
	}

	return (
		<button
			type="button"
			className={clsx('cursor-pointer text-red-600', {
				'!disabled !text-gray-700 !cursor-not-allowed': status === 'settled',
			})}
			{...props}
		>
			{text}
		</button>
	);
}
