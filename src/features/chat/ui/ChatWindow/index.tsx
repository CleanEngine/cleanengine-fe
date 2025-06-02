import { motion } from 'motion/react';
import {
	type ChangeEvent,
	type FormEvent,
	type ReactNode,
	useRef,
} from 'react';

import useDimensions from '~/shared/hooks/useDimensions';

type ChatWindowProps = {
	children: ReactNode;
	state: 'idle' | 'processing' | 'complete';
	inputValue: string;
	handleInputValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleClose?: VoidFunction;
	handleSubmit: (e: FormEvent) => void;
};

const backgroundVariant = {
	open: (height = 480) => ({
		clipPath: `circle(${height * 2 + 600}px at calc(100% - 24px) calc(100% - 24px))`,
		transition: {
			type: 'spring',
			stiffness: 20,
			restDelta: 2,
		},
	}),
	closed: {
		clipPath: 'circle(24px at calc(100% - 24px) calc(100% - 24px))',
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 40,
		},
	},
	exit: {
		clipPath: 'circle(24px at calc(100% - 24px) calc(100% - 24px))',
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 40,
			duration: 0.3,
		},
	},
};

const shadowVariant = {
	open: {
		boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
		transition: { delay: 0.1, duration: 0.3 },
	},
	closed: {
		boxShadow: 'none',
		transition: { duration: 0.2 },
	},
	exit: {
		boxShadow: 'none',
		transition: { duration: 0.2 },
	},
};

const contentVariant = {
	open: {
		opacity: 1,
		transition: { delay: 0.4, duration: 0.3 },
	},
	closed: {
		opacity: 0,
		transition: { duration: 0.1 },
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.2 },
	},
};

export default function ChatWindow({
	children,
	state,
	inputValue,
	handleInputValueChange: onInputValueChange,
	handleSubmit,
	handleClose,
}: ChatWindowProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { height } = useDimensions(containerRef);
	const disabled = state === 'processing' || state === 'complete';

	return (
		<motion.div
			key="chat-window"
			ref={containerRef}
			className="absolute right-4 bottom-4 h-120 w-80 overflow-hidden rounded-2xl"
			initial="closed"
			animate="open"
			exit="exit"
			variants={shadowVariant}
			data-testid="chat-window"
		>
			<motion.div
				className="absolute inset-0 bg-white"
				initial="closed"
				animate="open"
				exit="exit"
				custom={height}
				variants={backgroundVariant}
			/>
			<motion.div
				className="relative h-full w-full"
				initial="closed"
				animate="open"
				exit="exit"
				variants={contentVariant}
			>
				<div className="flex h-full flex-col">
					<div className="flex items-center justify-between border-gray-400 border-b p-4">
						<h3 className="font-medium text-lg">채팅 상담</h3>
						<button
							type="button"
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 hover:bg-gray-100"
							onClick={handleClose}
							data-testid="chat-window-close-button"
						>
							<span className="text-xl">×</span>
						</button>
					</div>
					<div className="custom-scroll flex-1 overflow-y-auto p-4">
						<div className="flex flex-col space-y-4">{children}</div>
					</div>
					<div className="border-gray-400 border-t p-4">
						<form className="flex items-center gap-2" onSubmit={handleSubmit}>
							<input
								type="text"
								className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
								placeholder="메시지를 입력하세요..."
								disabled={disabled}
								value={disabled ? 'AI가 답변 중입니다.' : inputValue}
								onChange={onInputValueChange}
							/>
							<button
								type="submit"
								disabled={disabled}
								className="flex aspect-square h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
							>
								<span>↑</span>
							</button>
						</form>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
