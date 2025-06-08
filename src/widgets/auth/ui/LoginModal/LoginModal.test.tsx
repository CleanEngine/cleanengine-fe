import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import LoginModal from '.';

const navigate = vi.fn();

vi.mock('react-router', () => ({
	useNavigate: () => navigate,
}));

describe('LoginModal 컴포넌트 테스트', () => {
	it('LoginModal이 렌더링된다.', () => {
		render(<LoginModal />);

		const loginModal = screen.getByRole('dialog');

		expect(loginModal).toBeInTheDocument();
	});

	it('Backdrop을 클릭하면 navigate가 호출된다.', async () => {
		const user = userEvent.setup();
		render(<LoginModal />);

		const backdrop = screen.getByTestId('backdrop');

		await user.click(backdrop);

		expect(navigate).toHaveBeenNthCalledWith(1, -1);
	});
});
