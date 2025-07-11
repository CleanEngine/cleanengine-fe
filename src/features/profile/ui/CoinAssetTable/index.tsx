import type { Wallet } from '~/entities/user';
import { formatCurrencyKR } from '~/shared/utils';
import { COLORS } from '../../const/chart.const';

type CoinAssetTableProps = {
	wallets: Wallet[];
};

const TABLE_HEAD_HEIGHT = 32;
const TABLE_ROW_HEIGHT = 36;

export default function CoinAssetTable({ wallets }: CoinAssetTableProps) {
	return (
		<div className="scrollbar-custom max-h-54 shrink-0 overflow-y-scroll rounded-md border-1 border-gray-400">
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
					{wallets.map((wallet, index) => {
						const color = COLORS[index % COLORS.length];
						const roiTextColor =
							wallet.roi > 0
								? '#fb2c36'
								: wallet.roi < 0
									? '#3b82f6'
									: '#9ca3af';
						return (
							<tr
								key={wallet.ticker}
								className="flex text-center text-gray-700"
								style={{ height: `${TABLE_ROW_HEIGHT}px` }}
							>
								<td className="flex flex-[0.5] items-center justify-center">
									<span
										className="mr-2 inline-block h-4 w-4 rounded-sm"
										style={{ backgroundColor: color.backgroundColor }}
									/>
								</td>
								<td className="flex flex-[0.5] items-center text-left font-semibold">
									{wallet.ticker}
								</td>
								<td className="flex flex-1 items-center justify-center">
									{formatCurrencyKR(wallet.buyPrice)}원
								</td>
								<td className="flex flex-1 items-center justify-center">
									{formatCurrencyKR(wallet.buyPrice * wallet.size)}원
								</td>
								<td
									className="flex flex-1 items-center justify-center text-gray-700"
									style={{ color: roiTextColor }}
								>
									{wallet.roi}%
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
