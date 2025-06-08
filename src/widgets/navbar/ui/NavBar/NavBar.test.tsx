import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { NavBarProps } from '.';
import NavBar from '.';

const props: NavBarProps = {
	to: '/',
	serviceName: 'IF',
	ticker: 'BTC',
	isLoggedIn: true,
	onClickMenuButton: vi.fn(),
};

const mockSubmit = vi.fn();

vi.mock('react-router', () => ({
	useSubmit: () => mockSubmit,
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
	NavLink: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

describe('NavBar 컴포넌트 테스트', () => {
	it('초기 상태에서 NavBar가 보여진다.', () => {
		render(<NavBar {...props} />);

		const navBar = screen.getByRole('navigation');

		expect(navBar).toBeInTheDocument();
	});

	it('로그인이 되어있으면 로그아웃 버튼이 보여진다.', () => {
		render(<NavBar {...props} />);

		const logoutButton = screen.getByRole('button', { name: '로그아웃' });

		expect(logoutButton).toBeInTheDocument();
	});

	it('로그아웃이 되어있으면 로그인 버튼이 보인다.', () => {
		render(<NavBar {...props} isLoggedIn={false} />);

		const loginButton = screen.getByRole('button', { name: '로그인' });

		expect(loginButton).toBeInTheDocument();
	});

	it('로그아웃 버튼을 누르면 submit으로 액션을 발생시킨다.', async () => {
		const user = userEvent.setup();
		render(<NavBar {...props} />);

		const logoutButton = screen.getByRole('button', { name: '로그아웃' });

		await user.click(logoutButton);

		expect(mockSubmit).toHaveBeenNthCalledWith(
			1,
			null,
			expect.objectContaining({
				action: '/trade/BTC',
				method: 'post',
			}),
		);
	});

	it('메뉴 버튼을 누르면 onClickMenuButton이 호출된다.', async () => {
		const user = userEvent.setup();
		render(<NavBar {...props} />);

		const menuButton = screen.getByTestId('menu-button');

		await user.click(menuButton);

		expect(props.onClickMenuButton).toHaveBeenCalledTimes(1);
	});
});
