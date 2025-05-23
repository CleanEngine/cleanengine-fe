import clsx from 'clsx';

type MessageBoxProps = {
	direction: 'left' | 'right';
	message: string;
};

export default function MessageBox({ direction, message }: MessageBoxProps) {
	return (
		<div
			className={clsx(
				'flex',
				direction === 'left' ? 'justify-start' : 'justify-end',
			)}
		>
			<div
				className={clsx(
					'rounded-xl px-3 py-1 text-sm',
					direction === 'left'
						? 'rounded-bl-none bg-gray-200 text-gray-800'
						: 'rounded-br-none bg-blue-500 text-white',
				)}
			>
				{message}
			</div>
		</div>
	);
}
