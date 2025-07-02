import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
	children: ReactNode;
	buttonStyle?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
	children,
	buttonStyle = 'primary',
	...props
}: ButtonProps) {
	return (
		<button
			className={clsx(
				'flex h-8 cursor-pointer items-center justify-center rounded-lg px-4 text-sm hover:opacity-90',
				buttonStyle === 'primary'
					? 'bg-primary text-white'
					: 'bg-transparent text-primary',
			)}
			{...props}
		>
			{children}
		</button>
	);
}
