import { useRef } from 'react';
import { useNavigate } from 'react-router';
import CloudLogo from '~/assets/images/cloud.webp';
import KakaoLoginButton from '~/features/auth/ui/KakaoLoginButton';

import useClickOutside from '~/shared/hooks/useClickOutside';
import Backdrop from '~/shared/ui/Backdrop';
import Modal from '~/shared/ui/Modal';

export default function LoginModal() {
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);
	useClickOutside(modalRef, () => navigate(-1));

	return (
		<Backdrop>
			<Modal ref={modalRef}>
				<div className="flex h-full w-full flex-col items-center p-4">
					<div className="mb-8 flex flex-col items-center">
						<img src={CloudLogo} alt="" className="w-18" />
						<p className="font-medium text-xl">Invest Future</p>
					</div>
					<p className="mb-18 font-normal text-sm">
						투자 시뮬레이션을 시작하기 위해 로그인해주세요
					</p>
					<KakaoLoginButton />
				</div>
			</Modal>
		</Backdrop>
	);
}
