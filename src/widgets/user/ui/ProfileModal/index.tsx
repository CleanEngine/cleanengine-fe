import { useRef } from 'react';
import { Outlet, useNavigate } from 'react-router';

import type { UserInfoResponseData } from '~/entities/user';
import AssetInfoGraphic from '~/features/profile/ui/AssetInfoGraphic';
import useClickOutside from '~/shared/hooks/useClickOutside';
import useCustomReferer from '~/shared/hooks/useCustomReferer';
import Backdrop from '~/shared/ui/Backdrop';
import Modal from '~/shared/ui/Modal';

type ProfileModalProps = {
	userInfo: UserInfoResponseData;
};

export default function ProfileModal({ userInfo }: ProfileModalProps) {
	const referer = useCustomReferer();
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);

	useClickOutside(modalRef, () => navigate(referer || '/trade/BTC'));

	return (
		<Backdrop>
			<Modal ref={modalRef}>
				<div className="scrollbar-custom flex max-h-screen flex-col items-center gap-3 overflow-y-auto px-20">
					<AssetInfoGraphic userInfo={userInfo} />
					<div className="w-full py-8">
						<Outlet />
					</div>
				</div>
			</Modal>
		</Backdrop>
	);
}
