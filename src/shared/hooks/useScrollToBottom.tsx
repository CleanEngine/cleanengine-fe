import { useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

export default function useScrollToBottom<
	T extends HTMLElement = HTMLDivElement,
>(dependencies: DependencyList = []) {
	const bottomElementRef = useRef<T>(null);

	useEffect(() => {
		if (!bottomElementRef.current) return;

		bottomElementRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	}, dependencies);

	return bottomElementRef;
}
