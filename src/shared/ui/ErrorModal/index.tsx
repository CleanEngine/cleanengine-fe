import { useRef } from 'react';
import { useNavigate } from 'react-router';

import useClickOutside from '~/shared/hooks/useClickOutside';
import useCustomReferer from '~/shared/hooks/useCustomReferer';
import Backdrop from '~/shared/ui/Backdrop';
import ErrorComponent, { type ErrorComponentProps } from '~/shared/ui/Error';
import Modal from '~/shared/ui/Modal';

type ErrorModalProps = ErrorComponentProps;

export default function ErrorModal({ title, description }: ErrorModalProps) {
	const referer = useCustomReferer();
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);

	useClickOutside(modalRef, () => navigate(referer || '/trade/BTC'));

	return (
		<Backdrop>
			<Modal ref={modalRef}>
				<div className="scrollbar-custom flex max-h-screen flex-col items-center gap-3 overflow-y-auto p-20 pt-10">
					<ErrorComponent title={title} description={description} />
				</div>
			</Modal>
		</Backdrop>
	);
}
