import { motion } from 'motion/react';

import { IconHeadset } from '~/assets/svgs';

type ChatButtonProps = {
	isOpen: boolean;
	handleClick: () => void;
};

const buttonVariant = {
	closed: {
		opacity: 1,
	},
	open: {
		opacity: 0,
		boxShadow: 'none',
	},
};

export default function ChatButton({ isOpen, handleClick }: ChatButtonProps) {
	return (
		<motion.button
			key="chat-button"
			type="button"
			className="absolute right-4 bottom-4 z-20 aspect-square w-12 cursor-pointer rounded-4xl bg-white p-2 shadow-sm"
			onClick={handleClick}
			initial={false}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			animate={isOpen ? 'open' : 'closed'}
			variants={buttonVariant}
			exit={{ opacity: 0 }}
			data-testid="chat-button"
		>
			<IconHeadset />
		</motion.button>
	);
}
