import { type RefObject, useEffect, useRef } from 'react';

export default function useScrollMiddle(
	scrollContainerRef: RefObject<HTMLElement | null>,
	dependency: unknown,
) {
	const isFirstRendered = useRef(true);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer || !isFirstRendered.current || !dependency) return;

		const middle = scrollContainer.clientHeight / 2;
		scrollContainer.scrollTo({ top: middle });

		isFirstRendered.current = false;
	}, [dependency, scrollContainerRef]);
}
