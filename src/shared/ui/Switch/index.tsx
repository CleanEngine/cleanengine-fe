import clsx from 'clsx';
import { type ButtonHTMLAttributes, type MouseEvent, useState } from 'react';

type Value = ButtonHTMLAttributes<HTMLButtonElement>['value'];

type SwitchProps<T extends Value> = {
	value1: T;
	value2: T;
	text1: string;
	text2: string;
	onChange?: (value: T) => void;
};

export default function Switch<T extends Value>({
	value1,
	value2,
	text1,
	text2,
	onChange,
}: SwitchProps<T>) {
	const [selected, setSelected] = useState<'left' | 'right'>('left');

	const handleSwitch = (e: MouseEvent<HTMLButtonElement>) => {
		if (e.currentTarget.value === String(value1)) {
			setSelected('left');
			onChange?.(value1);
		} else {
			setSelected('right');
			onChange?.(value2);
		}
	};

	return (
		<div className="relative flex h-8 select-none items-center rounded-md bg-gray-100 font-normal text-gray-600 text-sm">
			<div
				className={clsx(
					selected === 'left' ? 'left-[25%]' : 'left-[75%]',
					'-translate-x-1/2 absolute top-1 z-0 h-6 w-[45%] rounded-md bg-white shadow transition-all duration-200',
				)}
			/>
			<button
				type="button"
				className="relative z-10 flex-1 cursor-pointer rounded-md focus:outline-none"
				onClick={handleSwitch}
				tabIndex={0}
				value={value1}
			>
				{text1}
			</button>
			<button
				type="button"
				className="relative z-10 flex-1 cursor-pointer rounded-md focus:outline-none"
				onClick={handleSwitch}
				tabIndex={0}
				value={value2}
			>
				{text2}
			</button>
		</div>
	);
}
