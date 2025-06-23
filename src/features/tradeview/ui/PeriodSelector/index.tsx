import type { MouseEvent } from 'react';
import Button from '../Button';

type PeriodSelectorProps = {
	periods: { period: number; text: string }[];
	selectedPeriod: number;
	onSelectPeriod: (e: MouseEvent<HTMLButtonElement>) => void;
};

export default function PeriodSelector({
	periods,
	onSelectPeriod,
	selectedPeriod,
}: PeriodSelectorProps) {
	return (
		<div className="flex gap-1">
			{periods.map((period) => (
				<Button
					key={period.period}
					onClick={onSelectPeriod}
					value={period.period}
					selected={period.period === selectedPeriod}
				>
					{period.text}
				</Button>
			))}
		</div>
	);
}
