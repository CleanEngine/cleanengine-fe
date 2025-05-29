import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import useClickOutside from './useClickOutside';
import useScrollToBottom from './useScrollToBottom';

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

describe('useScrollToBottom 훅 테스트', () => {
	it('dependencies가 변경되면 scrollIntoView를 호출한다.', () => {
		const mockScrollIntoView = vi.fn();

		const { result, rerender } = renderHook(
			({ deps }) => useScrollToBottom(deps),
			{ initialProps: { deps: [1] } },
		);

		act(() => {
			const element = document.createElement('div');
			element.scrollIntoView = mockScrollIntoView;
			result.current.current = element;
		});

		rerender({ deps: [2] });

		expect(mockScrollIntoView).toHaveBeenCalled();
	});
});

// FIXME: 테스트 환경에서 getBoundingClientRect를 mock으로 처리할 수 없음
// describe('useDimensions 훅 테스트', () => {
// 	it('참조하는 element의 width와 height가 반환된다.', () => {
// 		const element = document.createElement('div');
// 		const ref = { current: element };
// 		vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
// 			width: 100,
// 			height: 100,
// 			x: 0,
// 			y: 0,
// 			top: 0,
// 			left: 0,
// 			right: 100,
// 			bottom: 100,
// 			toJSON: () => {},
// 		}));

// 		const { result } = renderHook(() => useDimensions(ref));

// 		expect(result.current.width).toBe(100);
// 		expect(result.current.height).toBe(100);
// 	});

// 	it('참조하는 element의 width와 height가 변경되면 변경된 값을 반환한다.', () => {
// 		const element = document.createElement('div');
// 		document.body.appendChild(element);
// 		const ref = { current: element };

// 		element.style.width = '100px';
// 		element.style.height = '100px';
// 		element.style.border = 'none';
// 		element.style.padding = 'none';

// 		const { result, rerender } = renderHook(() => useDimensions(ref));

// 		expect(result.current.width).toBe(100);
// 		expect(result.current.height).toBe(100);

// 		element.style.height = '10px';
// 		element.style.width = '10px';

// 		rerender();

// 		expect(result.current.height).toBe(10);
// 		expect(result.current.width).toBe(10);
// 	});
// });
