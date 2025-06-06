import { useEffect, useRef } from 'react';

export default function useDimensions(
	ref: React.RefObject<HTMLDivElement | null>,
) {
	const dimensions = useRef({ width: 0, height: 0 });

	useEffect(() => {
		if (ref.current) {
			dimensions.current.width = ref.current.offsetWidth;
			dimensions.current.height = ref.current.offsetHeight;
		}
	}, [ref.current]);

	return dimensions.current;
}
