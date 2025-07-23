import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
	children: ReactNode;
	buttonStyle?: 'primary' | 'secondary' | 'warn';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
	children,
	buttonStyle = 'primary',
	...props
}: ButtonProps) {
	return (
		<button
			className={clsx(
				'flex h-8 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm text-white hover:opacity-90',
				buttonStyle === 'secondary' && '!bg-transparent !text-primary',
				buttonStyle === 'warn' &&
					'!text-red-500 !bg-transparent border-1 border-red-500',
			)}
			{...props}
		>
			{children}
		</button>
	);
}
