import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Button from '.';

describe('Button 컴포넌트 테스트', () => {
	it('props로 전달된 children이 렌더링 된다.', () => {
		const text = '버튼';
		render(<Button>{text}</Button>);

		const button = screen.getByRole('button');

		expect(button).toHaveTextContent(text);
	});

	it('button을 클릭하면 props로 전달된 onClick이 호출된다.', async () => {
		const spy = vi.fn();
		const user = userEvent.setup();

		render(<Button onClick={spy}>버튼</Button>);

		const button = screen.getByRole('button');
		await user.click(button);

		expect(spy).toHaveBeenCalled();
	});
});
