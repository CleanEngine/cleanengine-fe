import clsx from 'clsx';
import type { MouseEvent } from 'react';
import { IconArrowLeft, IconArrowRight } from '~/assets/svgs';

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	showCount: number;
	onClick: (page: number) => void;
	onPrevClick: () => void;
	onNextClick: () => void;
};

export default function Pagination({
	currentPage,
	totalPages,
	showCount,
	onClick,
	onPrevClick,
	onNextClick,
}: Readonly<PaginationProps>) {
	const pages: number[] = [];

	const currentSection = Math.ceil(currentPage / showCount);
	const sectionStart = (currentSection - 1) * showCount + 1;
	const sectionEnd = Math.min(currentSection * showCount, totalPages);

	for (let page = sectionStart; page <= sectionEnd; page++) {
		pages.push(page);
	}

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		onClick(Number(e.currentTarget.value));
	};

	return (
		<div className="flex h-12 w-full items-center justify-center gap-6">
			<button
				onClick={onPrevClick}
				type="button"
				className="w-3 cursor-pointer fill-gray-300 hover:fill-gray-500"
			>
				<IconArrowLeft />
			</button>
			{pages.map((page) => (
				<button
					key={page}
					onClick={handleClick}
					type="button"
					className={clsx(
						'w-3 cursor-pointer text-gray-500 hover:text-gray-800',
						currentPage === page && '!font-semibold !text-blue-500',
					)}
					value={page}
				>
					{page}
				</button>
			))}
			<button
				onClick={onNextClick}
				type="button"
				className="w-3 cursor-pointer fill-gray-300 hover:fill-gray-500"
			>
				<IconArrowRight />
			</button>
		</div>
	);
}
