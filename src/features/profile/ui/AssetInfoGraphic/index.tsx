import type { UserInfoResponseData } from '~/entities/user';
import { CoinPieChart } from '~/features/profile';
import { generateCoinPieChartData } from '../../utils';
import AssetInfoGraphicText from '../AssetInfoGraphicText';

type AssetInfoGraphicProps = {
	userInfo: UserInfoResponseData;
};

export default function AssetInfoGraphic({ userInfo }: AssetInfoGraphicProps) {
	const { wallets, totalAssetAmount } = userInfo;
	const coinData = generateCoinPieChartData(wallets);
	const roiAverage =
		wallets.reduce((acc, item) => acc + item.roi, 0) / wallets.length;

	return (
		<div className="flex h-100 w-180 items-center justify-center gap-6 ">
			<div className="h-full flex-1/5">
				<CoinPieChart coinData={coinData} />
			</div>
			<div className="flex flex-1/5 justify-center gap-10">
				<div className="flex flex-col gap-6">
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
				<AssetInfoGraphicText
					label="예수금"
					type="money"
					value={userInfo.cash}
				/>
			</div>
		</div>
	);
}
