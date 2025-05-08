import type { ReactNode } from 'react';

type ContainerProps = {
	children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
	return (
		<div className="inline-block min-h-60 w-auto min-w-[240px] rounded-xl bg-white">
			{children}
		</div>
	);
}
