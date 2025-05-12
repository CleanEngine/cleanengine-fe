import clsx from 'clsx';
import type { Order } from '../../type/order';

export type ExecutionItemProps = { isGray?: boolean } & Order;

export default function ExecutionItem({
	executionPrice,
	executionVolume,
	fluctuationRate,
	transactionAmount,
	time,
	isGray,
}: ExecutionItemProps) {
	return (
		<div
			className={clsx(
				isGray && 'bg-gray-100',
				'flex rounded-lg p-2 py-1.5 font-normal text-gray-500 text-sm',
			)}
		>
			<div className="flex-2 text-left">
				<span>{executionPrice}원</span>
			</div>
			<div className="flex-1 text-right">
				<span>{executionVolume}</span>
			</div>
			<div
				className={clsx(
					fluctuationRate > 0 ? 'text-red-600' : 'text-blue-700',
					'flex-1 text-right',
				)}
			>
				<span>{fluctuationRate}%</span>
			</div>
			<div className="flex-1 text-right">
				<span>{transactionAmount}</span>
			</div>
			<div className="flex-1 text-right text-gray-400">
				<span>{time}</span>
			</div>
		</div>
	);
}
