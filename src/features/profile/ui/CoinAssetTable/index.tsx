import clsx from 'clsx';
import type { Wallet } from '~/entities/user';
import { formatCurrencyKR } from '~/shared/utils';

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
					<tr className="text-center text-gray-600">
						<th>티커</th>
						<th>평균단가</th>
						<th>평가금액</th>
						<th>수익률</th>
					</tr>
				</thead>
				<tbody style={{ marginTop: `${TABLE_HEAD_HEIGHT}px` }}>
					{wallets.map((wallet) => (
						<tr
							key={wallet.ticker}
							className={clsx(
								'text-center text-gray-700',
								wallet.roi > 0 ? 'bg-red-50' : 'bg-blue-50',
							)}
							style={{ height: `${TABLE_ROW_HEIGHT}px` }}
						>
							<td className="font-semibold">{wallet.ticker}</td>
							<td>{formatCurrencyKR(wallet.buyPrice)}원</td>
							<td>{formatCurrencyKR(wallet.buyPrice * wallet.size)}원</td>
							<td
								className={clsx(
									'text-gray-700',
									wallet.roi > 0 ? 'text-red-500' : 'text-blue-500',
								)}
							>
								{wallet.roi}%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
