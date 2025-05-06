import type { ReactNode } from 'react';

export type ButtonProps = {
	children: ReactNode;
	type?: 'button' | 'submit' | 'reset';
};

export default function Button({ children, type = 'button' }: ButtonProps) {
	return (
		<button
			type={type}
			className="h-8 px-4 flex items-center justify-center bg-primary rounded-lg text-white text-sm cursor-pointer"
		>
			{children}
		</button>
	);
}
