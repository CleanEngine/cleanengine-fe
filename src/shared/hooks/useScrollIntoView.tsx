import { useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

export default function useScrollIntoView<
	T extends HTMLElement = HTMLDivElement,
>(dependencies: DependencyList = [], options?: ScrollIntoViewOptions) {
	const bottomElementRef = useRef<T>(null);

	useEffect(() => {
		if (!bottomElementRef.current) return;

		bottomElementRef.current.scrollIntoView(options);
	}, [...dependencies, options]);

	return bottomElementRef;
}
