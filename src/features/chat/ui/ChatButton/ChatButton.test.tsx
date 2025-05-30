import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { userEvent } from '@testing-library/user-event';
import ChatButton from '.';

const props = {
	isOpen: false,
	handleClick: vi.fn(),
};

describe('ChatButton 컴포넌트 테스트', () => {
	it('초기 상태에서 ChatButton이 보여진다.', () => {
		render(<ChatButton {...props} />);

		const button = screen.getByRole('button');

		expect(button).toBeInTheDocument();
	});

	it('button의 props로 isOpen이 true일 때 화면에 사라진다.', () => {
		render(<ChatButton {...props} isOpen={true} />);

		const button = screen.getByRole('button');

		expect(button).toHaveStyle({ opacity: 0, boxShadow: 'none' });
	});

	it('button의 props로 isOpen이 false일 때 화면에 보인다.', () => {
		render(<ChatButton {...props} isOpen={false} />);

		const button = screen.getByRole('button');

		expect(button).toHaveStyle({ opacity: 1 });
	});

	it('사용자가 button을 클릭하면 handleClick이 호출된다.', async () => {
		const user = userEvent.setup();
		render(<ChatButton {...props} />);

		const button = screen.getByRole('button');

		expect(button).toBeInTheDocument();

		await user.click(button);

		expect(props.handleClick).toHaveBeenCalledTimes(1);
	});
});
