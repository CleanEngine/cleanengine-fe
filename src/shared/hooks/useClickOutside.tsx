import { type RefObject, useEffect } from 'react';

export default function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	onClickOutside: VoidFunction,
) {
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node))
				onClickOutside();
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [ref, onClickOutside]);
}
