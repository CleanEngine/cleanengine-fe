import type { ReactNode, Ref } from 'react';

type ModalProps = {
	children: ReactNode;
	ref: Ref<HTMLDialogElement>;
};

export default function Modal({ children, ref }: Readonly<ModalProps>) {
	return (
		<dialog
			open
			ref={ref}
			className="absolute top-1/2 left-1/2 h-[min(100%,20rem)] min-w-xs translate-x-[-50%] translate-y-[-50%] rounded-md"
		>
			{children}
		</dialog>
	);
}
