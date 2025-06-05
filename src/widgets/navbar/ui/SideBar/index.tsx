import { useRef } from 'react';

import {
	type CoinListItemProps,
	CoinListWithSearchBar,
} from '~/features/coin-search-list';
import useClickOutside from '~/shared/hooks/useClickOutside';
import Backdrop from '~/shared/ui/Backdrop';
import CloseButton from '~/shared/ui/CloseButton';
import ContainerTitle from '~/shared/ui/ContainerTitle';

type SideBarProps = {
	coinListWithIcon: CoinListItemProps[];
	onClose: () => void;
};

export default function SideBar({ coinListWithIcon, onClose }: SideBarProps) {
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, onClose);

	return (
		<Backdrop>
			<div ref={ref} className="h-full w-full max-w-2xl bg-white p-4">
				<div className="flex items-center justify-between">
					<ContainerTitle>가상화폐 리스트</ContainerTitle>
					<CloseButton onClick={onClose} />
				</div>
				<CoinListWithSearchBar coinList={coinListWithIcon} />
			</div>
		</Backdrop>
	);
}
