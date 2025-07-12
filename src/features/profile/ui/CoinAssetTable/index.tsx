import type { RefObject } from 'react';
import { formatCurrencyKR } from '~/shared/utils';
import {
	COLORS,
	TABLE_HEAD_HEIGHT,
	TABLE_ROW_HEIGHT,
} from '../../const/chart.const';
import type { CoinPieChartData } from '../../types/chart.type';

type CoinAssetTableProps = {
	coinData: CoinPieChartData[];
	ref?: RefObject<HTMLDivElement | null>;
};

export default function CoinAssetTable({ coinData, ref }: CoinAssetTableProps) {
	return (
		<div
			ref={ref}
			className="scrollbar-custom max-h-54 shrink-0 overflow-y-scroll rounded-md border-1 border-gray-400"
		>
			<table className="w-200 border-collapse">
				<thead
					className="sticky top-0 bg-white"
					style={{ height: `${TABLE_HEAD_HEIGHT}px` }}
				>
					<tr
						className="flex items-center text-center text-gray-600"
						style={{ height: `${TABLE_HEAD_HEIGHT}px` }}
					>
						<th className="flex-[0.5] font-medium" />
						<th className="flex-[0.5] text-left font-medium">티커</th>
						<th className="flex-1 font-medium">평균단가</th>
						<th className="flex-1 font-medium">평가금액</th>
						<th className="flex-1 font-medium">수익률</th>
					</tr>
				</thead>
				<tbody style={{ marginTop: `${TABLE_HEAD_HEIGHT}px` }}>
					{coinData.map((coin, index) => {
						const color = COLORS[index % COLORS.length];
						const roiTextColor =
							coin.roi > 0 ? '#fb2c36' : coin.roi < 0 ? '#3b82f6' : '#9ca3af';
						return (
							<tr
								key={coin.ticker}
								className="flex text-center text-gray-700 "
								style={{ height: `${TABLE_ROW_HEIGHT}px` }}
								data-ticker={coin.ticker}
							>
								<td className="flex flex-[0.5] items-center justify-center">
									<span
										className="mr-2 inline-block h-4 w-4 rounded-sm"
										style={{ backgroundColor: color.backgroundColor }}
									/>
								</td>
								<td className="flex flex-[0.5] items-center text-left font-semibold">
									{coin.ticker}
								</td>
								<td className="flex flex-1 items-center justify-center">
									{formatCurrencyKR(coin.averagePrice)}원
								</td>
								<td className="flex flex-1 items-center justify-center">
									{formatCurrencyKR(coin.totalPrice)}원
								</td>
								<td
									className="flex flex-1 items-center justify-center text-gray-700"
									style={{ color: roiTextColor }}
								>
									{coin.roi}%
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
