import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
	children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
	return (
		<button
			className="flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm text-white"
			{...props}
		>
			{children}
		</button>
	);
}
