import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { formatCurrencyKR } from '~/shared/utils';

type IncrementingNumberProps = {
	children: number | string;
	formatToCurrencyKr?: boolean;
	duration?: number;
};

export default function IncrementingNumber({
	children,
	formatToCurrencyKr = false,
	duration = 1,
}: IncrementingNumberProps) {
	const number = Number(children);

	if (typeof children !== 'number' || Number.isNaN(number)) {
		throw new Error('children must be a number');
	}

	const value = useMotionValue(0);
	const rounded = useTransform(() =>
		formatToCurrencyKr
			? formatCurrencyKR(Math.round(value.get()))
			: String(Math.round(value.get())),
	);

	useEffect(() => {
		const control = animate(value, number, {
			duration,
			ease: 'easeOut',
		});

		return () => control.stop();
	}, [number, value, duration]);

	return <motion.span>{rounded}</motion.span>;
}
