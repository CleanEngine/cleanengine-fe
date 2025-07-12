import { useRef } from 'react';
import type { UserInfoResponseData } from '~/entities/user';
import { CoinPieChart } from '~/features/profile';
import { TABLE_HEAD_HEIGHT } from '../../const/chart.const';
import type { CoinPieChartData } from '../../types/chart.type';
import { generateCoinPieChartData } from '../../utils';
import AssetInfoGraphicText from '../AssetInfoGraphicText';
import CoinAssetTable from '../CoinAssetTable';

type AssetInfoGraphicProps = {
	userInfo: UserInfoResponseData;
};

export default function AssetInfoGraphic({ userInfo }: AssetInfoGraphicProps) {
	const assetTableRef = useRef<HTMLDivElement>(null);
	const { wallets, totalAssetAmount } = userInfo;
	const coinData = generateCoinPieChartData(wallets);
	const roiAverage =
		wallets.reduce((acc, item) => acc + item.roi, 0) / wallets.length;

	const handleClickChart = (data: CoinPieChartData) => {
		if (!assetTableRef.current) return;

		const targetRow = assetTableRef.current.querySelector(
			`[data-ticker="${data.ticker}"]`,
		) as HTMLElement;

		if (!targetRow) return;

		assetTableRef.current.scrollTo({
			top: targetRow.offsetTop - TABLE_HEAD_HEIGHT,
			behavior: 'smooth',
		});
	};

	return (
		<>
			<div className="flex h-100 w-180 shrink-0 items-center justify-center gap-6 ">
				<div className="h-full flex-1/5">
					<CoinPieChart coinData={coinData} onClick={handleClickChart} />
				</div>
				<div className="flex flex-1/5 justify-center gap-10">
					<div className="flex flex-1 flex-col gap-6">
						<AssetInfoGraphicText
							label="총평가금액"
							type="money"
							value={totalAssetAmount}
						/>
						<AssetInfoGraphicText
							label="수익률 평균"
							type="percent"
							value={roiAverage}
						/>
					</div>
					<div className="flex-1">
						<AssetInfoGraphicText
							label="예수금"
							type="money"
							value={userInfo.cash}
						/>
					</div>
				</div>
			</div>
			<CoinAssetTable coinData={coinData} ref={assetTableRef} />
		</>
	);
}
