import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import { formatCurrencyKR } from '~/shared/utils';
import type { CoinPieChartData } from '../../types/chart.type';

export default function CoinPieChartTooltip({
	active,
	payload,
}: TooltipContentProps<string, number>) {
	if (!active) return null;

	const payloadData = payload[0].payload as CoinPieChartData;
	return (
		<div className="flex h-auto w-auto flex-col gap-1 rounded-sm border-[#E5E5E5] border-[1px] bg-white/80 p-3 text-gray-800 backdrop-blur-xs">
			<span className=" mb-1 block font-semibold text-md">
				{payloadData.ticker}
			</span>
			<p>
				평균매수가격:{' '}
				<span className="font-semibold text-gray-800">
					{formatCurrencyKR(payloadData.averagePrice)}원
				</span>
			</p>
			<p>
				매수수량:{' '}
				<span className="font-semibold text-gray-800">
					{payloadData.quantity}개
				</span>
			</p>
			<p className="mt-1">
				총매수금액:{' '}
				<span className=" font-semibold text-gray-800">
					{formatCurrencyKR(payloadData.totalPrice)}원
				</span>
			</p>
		</div>
	);
}
