import clsx from 'clsx';
import { formatCurrencyKR } from '~/shared/utils';
import type { Execution } from '../../types/execution.type';

export type ExecutionItemProps = { isGray?: boolean } & Execution;

export default function ExecutionItem({
	price,
	size,
	timestamp,
	isGray,
	changeRate,
}: ExecutionItemProps) {
	const color =
		changeRate > 0
			? 'text-red-600'
			: changeRate < 0
				? 'text-blue-700'
				: 'text-gray-400';

	return (
		<div
			className={clsx(
				isGray && 'bg-gray-100',
				'flex rounded-lg p-2 py-1.5 font-normal text-gray-500 text-sm',
			)}
			data-testid="execution-item"
		>
			<div className="flex-1 text-left">
				<span>{formatCurrencyKR(price)}원</span>
			</div>
			<div className="flex-1 text-right">
				<span>{size}</span>
			</div>
			<div className={clsx(color, 'flex-1 text-right')}>
				<span>{changeRate.toFixed(2)}%</span>
			</div>
			{/* <div className="flex-1 text-right">
				<span>{transactionAmount}</span>
			</div> */}
			<div className="flex-1 text-right text-gray-400">
				<span>
					{Intl.DateTimeFormat('ko-KR', {
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
					}).format(new Date(timestamp))}
				</span>
			</div>
		</div>
	);
}
