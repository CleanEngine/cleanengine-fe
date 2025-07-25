import { type DependencyList, useEffect, useRef } from 'react';

export default function useScrollTo<T extends HTMLElement = HTMLDivElement>(
	dependencies: DependencyList = [],
	options?: ScrollToOptions,
) {
	const scrollContainerRef = useRef<T>(null);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;

		if (!scrollContainer) return;

		scrollContainer.scrollTo(options);
	}, [...dependencies, options]);

	return scrollContainerRef;
}
