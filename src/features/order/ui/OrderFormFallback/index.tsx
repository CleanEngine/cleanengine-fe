import { Link } from 'react-router';
import type { CoinTicker } from '~/entities/coin';

type OrderFormFallbackProps = {
	ticker: CoinTicker;
};

export default function OrderFormFallback({
	ticker,
}: Readonly<OrderFormFallbackProps>) {
	return (
		<div className="flex flex-col gap-2 pt-2 text-base">
			<div className="flex flex-col items-center justify-center space-y-6 py-8">
				<div className="text-center">
					<p className="mb-4 text-gray-800 text-lg">
						거래를 하시려면 로그인이 필요합니다.
					</p>
					<p className="text-gray-700 text-sm">
						로그인 후 코인 거래를 시작하세요.
					</p>
				</div>
				<Link
					to={`/trade/${ticker}/login`}
					className="w-full rounded-lg bg-red-500 py-1.5 text-center text-white hover:bg-red-600"
				>
					로그인
				</Link>
			</div>
		</div>
	);
}
