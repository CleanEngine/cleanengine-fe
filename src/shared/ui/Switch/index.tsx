import clsx from 'clsx';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';

type Value = ButtonHTMLAttributes<HTMLButtonElement>['value'];

type SwitchProps<T extends Value, T1 extends T, T2 extends T> = {
	value1: T1;
	value2: T2;
	text1: string;
	text2: string;
	selected: T1 | T2;
	onChange?: (value: T1 | T2) => void;
};

export default function Switch<T extends Value, T1 extends T, T2 extends T>({
	value1,
	value2,
	text1,
	text2,
	onChange,
	selected,
}: SwitchProps<T, T1, T2>) {
	const handleSwitch = (e: MouseEvent<HTMLButtonElement>) => {
		if (e.currentTarget.value === String(value1)) {
			onChange?.(value1);
		} else {
			onChange?.(value2);
		}
	};

	return (
		<div
			className="relative flex h-8 select-none items-center rounded-md bg-gray-100 font-normal text-gray-600 text-sm"
			data-testid="switch"
		>
			<div
				className={clsx(
					selected === value1 ? 'left-[25%]' : 'left-[75%]',
					'-translate-x-1/2 absolute top-1 z-0 h-6 w-[48%] rounded-md bg-white shadow transition-all duration-200',
				)}
			/>
			<button
				type="button"
				className="relative z-10 flex-1 cursor-pointer rounded-md focus:outline-none"
				onClick={handleSwitch}
				tabIndex={0}
				value={value1}
				data-testid="switch-button-1"
			>
				{text1}
			</button>
			<button
				type="button"
				className="relative z-10 flex-1 cursor-pointer rounded-md focus:outline-none"
				onClick={handleSwitch}
				tabIndex={0}
				value={value2}
				data-testid="switch-button-2"
			>
				{text2}
			</button>
		</div>
	);
}
