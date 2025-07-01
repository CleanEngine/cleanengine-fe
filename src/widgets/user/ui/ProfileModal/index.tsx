import { useRef } from 'react';
import { useNavigate } from 'react-router';
import useClickOutside from '~/shared/hooks/useClickOutside';
import Backdrop from '~/shared/ui/Backdrop';
import Modal from '~/shared/ui/Modal';

export default function ProfileModal() {
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);
	useClickOutside(modalRef, () => navigate(-1));
	return (
		<Backdrop>
			<Modal ref={modalRef}>
				<div>ProfileModal</div>
			</Modal>
		</Backdrop>
	);
}
