import { motion } from 'motion/react';
import type { MouseEvent } from 'react';

type TabItem = {
	value: string;
	label: string;
};

type TabProps = {
	items: TabItem[];
	selected: TabItem['value'];
	onClick?: (value: TabItem['value']) => void;
};

export default function Tab({ items, selected, onClick }: Readonly<TabProps>) {
	const handleTabClick = (e: MouseEvent<HTMLButtonElement>) => {
		const value = e.currentTarget.value;
		onClick?.(value);
	};

	return (
		<div className="h-8 w-full">
			<ul className="flex h-full w-full">
				{items.map((item, index) => (
					<>
						<li key={item.value} className="flex flex-1 flex-col text-center">
							<button
								type="button"
								value={item.value}
								onClick={handleTabClick}
								className="flex-1 cursor-pointer text-gray-800"
							>
								{item.label}
							</button>
							{selected === item.value ? (
								<motion.span
									layoutId="selected-indicator"
									className="block h-1 w-full bg-blue-800"
								/>
							) : (
								<span className="block h-1 w-full bg-transparent" />
							)}
						</li>
						{index < items.length - 1 && (
							<li key={`divider-${item.value}`}>
								<div className="h-full w-0.5 bg-gray-100" />
							</li>
						)}
					</>
				))}
			</ul>
		</div>
	);
}
