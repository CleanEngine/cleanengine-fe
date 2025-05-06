import type { ReactNode } from 'react';

export type ButtonProps = {
	children: ReactNode;
	type?: 'button' | 'submit' | 'reset';
};

export default function Button({ children, type = 'button' }: ButtonProps) {
	return (
		<button
			type={type}
			className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm text-white"
		>
			{children}
		</button>
	);
}
