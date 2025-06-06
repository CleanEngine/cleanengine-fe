import type { ReactNode } from 'react';

type ContainerProps = {
	children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
	return (
		<div className="flex h-full min-h-60 w-full min-w-[240px] flex-col rounded-xl bg-white p-4">
			{children}
		</div>
	);
}
