import type { ButtonHTMLAttributes } from 'react';
import { useFetcher, useLocation } from 'react-router';
import Spinner from '~/shared/ui/Spinner';
import {
	OrderStatus,
	type TradingHistory,
} from '../../types/tradingHistory.type';

type TradingHistoryCancelButtonProps = {
	status: TradingHistory['orderStatus'];
	orderId: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function TradingHistoryCancelButton({
	status,
	orderId,
	...props
}: TradingHistoryCancelButtonProps) {
	const location = useLocation();
	const fetcher = useFetcher();
	const isDeleting = fetcher.state !== 'idle';

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

	const isDisabled = status === OrderStatus.SETTLED || isDeleting;

	return (
		<>
			{isDeleting ? (
				<Spinner />
			) : (
				<fetcher.Form method="delete" action={location.pathname}>
					<input type="hidden" name="orderId" value={orderId} />
					<button
						type="submit"
						className="disabled:!text-gray-700 disabled:!cursor-not-allowed cursor-pointer text-red-600"
						disabled={isDisabled}
						{...props}
					>
						{text}
					</button>
				</fetcher.Form>
			)}
		</>
	);
}
