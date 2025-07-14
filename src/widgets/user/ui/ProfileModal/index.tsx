import { useRef } from 'react';
import { useNavigate } from 'react-router';

import type { UserInfoResponseData } from '~/entities/user';
import AssetInfoGraphic from '~/features/profile/ui/AssetInfoGraphic';
import TradingHistory from '~/features/profile/ui/TradingHistoryList';
import useClickOutside from '~/shared/hooks/useClickOutside';
import Backdrop from '~/shared/ui/Backdrop';
import Modal from '~/shared/ui/Modal';

type ProfileModalProps = {
	userInfo: UserInfoResponseData;
};

export default function ProfileModal({ userInfo }: ProfileModalProps) {
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);
	useClickOutside(modalRef, () => navigate(-1));

	return (
		<Backdrop>
			<Modal ref={modalRef}>
				<div className="scrollbar-custom flex max-h-screen flex-col items-center gap-3 overflow-y-auto p-20 pt-10">
					<AssetInfoGraphic userInfo={userInfo} />
					<TradingHistory />
				</div>
			</Modal>
		</Backdrop>
	);
}
