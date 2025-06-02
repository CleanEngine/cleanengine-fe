import { type ChangeEvent, useState } from 'react';

import { IconMagnifying } from '~/assets/svgs';
import type { CoinListItemProps } from '../CoinListItem';
import CoinListItem from '../CoinListItem';

export type CoinListWithSearchBarProps = {
	coinList: CoinListItemProps[];
};

export default function CoinListWithSearchBar({
	coinList,
}: CoinListWithSearchBarProps) {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredCoinList = coinList.filter((coin) =>
		coin.ticker.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div
			className="flex h-full min-h-0 flex-1 flex-col bg-white"
			data-testid="coin-list-with-search-bar"
		>
			<div className="px-2 py-3">
				<div className="relative w-full">
					<input
						type="text"
						className="h-8 w-full rounded-sm bg-gray-100 px-3 pl-8"
						placeholder="가상자산 검색"
						onChange={handleSearchChange}
						value={searchQuery}
					/>
					<IconMagnifying className="-translate-y-1/2 absolute top-1/2 left-2 w-4 object-center" />
				</div>
			</div>
			<div className="flex items-center border-gray-200 border-t px-2 py-3">
				<div className="flex-1 text-gray-500 text-sm">
					<span>가상자산 명</span>
				</div>
				<div className="flex-1 text-right text-gray-500 text-sm">
					<span>가격</span>
				</div>
				<div className="flex-1 text-right text-gray-500 text-sm">
					<span>변동률</span>
				</div>
				<div className="flex-1 text-right text-gray-500 text-sm">
					<span>거래량</span>
				</div>
			</div>
			<div className="scrollbar-custom min-h-0 flex-1 overflow-y-scroll">
				{filteredCoinList.map((coin) => (
					<CoinListItem key={coin.ticker} {...coin} />
				))}
			</div>
		</div>
	);
}
