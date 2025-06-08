import { motion } from 'motion/react';
import type { HTMLAttributes } from 'react';

export type BackdropProps = HTMLAttributes<HTMLDivElement>;

const backdropVariant = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export default function Backdrop({ children }: BackdropProps) {
	return (
		<motion.div
			className="absolute top-0 right-0 bottom-0 left-0 z-50 bg-[rgba(0,0,0,0.4)]"
			variants={backdropVariant}
			initial="initial"
			animate="animate"
			exit="exit"
			data-testid="backdrop"
		>
			{children}
		</motion.div>
	);
}
