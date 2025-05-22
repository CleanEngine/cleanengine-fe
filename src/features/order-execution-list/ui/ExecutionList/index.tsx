import type { CoinTicker } from '~/entities/coin';
import useExecutionListData from '../../hooks/useExecutionListData';
import ExecutionItem from '../ExecutionItem';

type ExecutionListProps = {
	ticker: CoinTicker;
};

export default function ExecutionList({ ticker }: ExecutionListProps) {
	const executionList = useExecutionListData(ticker);

	const orderList = executionList.length ? (
		executionList.map((execution, index) => (
			<ExecutionItem
				key={execution.transactionId}
				isGray={index % 2 === 0}
				{...execution}
			/>
		))
	) : (
		<span className="text-gray-400 text-sm">데이터가 없습니다.</span>
	);

	return (
		<div className="flex min-h-0 min-w-xs flex-1 flex-col text-sm">
			<div className="flex p-2 font-normal">
				<div className="flex-1 text-left text-gray-900">
					<span>체결가</span>
				</div>
				<div className="flex-1 text-right text-gray-900">
					<span>체결량</span>
				</div>
				<div className="flex-1 text-right text-gray-900">
					<span>등락률</span>
				</div>
				{/* <div className="flex-1 text-right text-gray-900">
					<span>거래량</span>
				</div> */}
				<div className="flex-1 text-right text-gray-900">
					<span>시간</span>
				</div>
			</div>
			<div className="scrollbar-custom min-h-0 flex-1 overflow-y-scroll pr-0.5">
				{orderList}
			</div>
		</div>
	);
}
