import type { MouseEvent } from 'react';
import Button from '../Button';

type IntervalSelectorProps = {
	intervals: { interval: number; text: string }[];
	selectedInterval: number;
	onSelectInterval: (e: MouseEvent<HTMLButtonElement>) => void;
};

export default function IntervalSelector({
	intervals,
	onSelectInterval,
	selectedInterval,
}: IntervalSelectorProps) {
	return (
		<div className="flex gap-1">
			{intervals.map((interval) => (
				<Button
					key={interval.interval}
					onClick={onSelectInterval}
					value={interval.interval}
					selected={interval.interval === selectedInterval}
				>
					{interval.text}
				</Button>
			))}
		</div>
	);
}
