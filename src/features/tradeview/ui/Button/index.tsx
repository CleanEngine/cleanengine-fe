import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
	ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
>;
export default function Button({ children, selected, ...props }: ButtonProps) {
	return (
		<button
			className={clsx(
				'cursor-pointer rounded-sm border-1 border-gray-300 bg-white px-2 py-0.5 text-gray-600 text-sm',
				selected && 'border-0! bg-blue-500! text-white!',
				props.className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
