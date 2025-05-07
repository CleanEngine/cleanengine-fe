import type { ReactNode, Ref } from 'react';

type ModalProps = {
	children: ReactNode;
	ref: Ref<HTMLDialogElement>;
};

export default function Modal({ children, ref }: ModalProps) {
	return (
		<dialog
			open
			ref={ref}
			className="absolute top-1/2 left-1/2 min-h-80 min-w-xs translate-x-[-50%] translate-y-[-50%] rounded-md border-1"
		>
			{children}
		</dialog>
	);
}
