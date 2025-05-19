import type { InputHTMLAttributes } from 'react';

export type NumberInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function NumberInput(props: NumberInputProps) {
	return (
		<input
			type="number"
			className="input-number-hide h-8 w-full flex-2 rounded-md border-1 border-gray-200 px-2 text-gray-700 text-sm disabled:cursor-not-allowed disabled:bg-gray-200"
			{...props}
		/>
	);
}
