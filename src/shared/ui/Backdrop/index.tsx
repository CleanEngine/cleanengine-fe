import type { HTMLAttributes } from 'react';

export type BackdropProps = HTMLAttributes<HTMLDivElement>;

export default function Backdrop({ children, ...props }: BackdropProps) {
	return (
		<div
			className="absolute top-0 right-0 bottom-0 left-0 z-50 bg-black opacity-40"
			{...props}
		>
			{children}
		</div>
	);
}
