import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import useClickOutside from './useClickOutside';

describe('useClickOutside 훅 테스트', () => {
	it('ref가 부착된 컴포넌트가 아닌 바깥 컴포넌트를 클릭하면 callback함수가 실행된다.', () => {
		const innerElement = document.createElement('div');
		const outerElement = document.createElement('div');
		outerElement.appendChild(innerElement);
		document.body.appendChild(outerElement);

		const ref = { current: innerElement };
		const callback = vi.fn();

		renderHook(() => useClickOutside(ref, callback));

		act(() => {
			const event = new MouseEvent('click', { bubbles: true });
			outerElement.dispatchEvent(event);
		});

		expect(callback).toHaveBeenCalled();
	});

	it('ref가 부착된 컴포넌트를 클릭하면 callback함수가 실행되지 않는다.', () => {
		const innerElement = document.createElement('div');
		const outerElement = document.createElement('div');
		outerElement.appendChild(innerElement);
		document.body.appendChild(outerElement);

		const ref = { current: innerElement };
		const callback = vi.fn();

		renderHook(() => useClickOutside(ref, callback));

		act(() => {
			const event = new MouseEvent('click', { bubbles: true });
			innerElement.dispatchEvent(event);
		});

		expect(callback).not.toHaveBeenCalled();
	});
});
