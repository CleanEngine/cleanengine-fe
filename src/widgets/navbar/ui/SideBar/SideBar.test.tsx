import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StompProvider from '~/app/provider/StompProvider';
import SideBar from '.';
import type { SideBarProps } from '.';

const props: SideBarProps = {
	onClose: vi.fn(),
	coinListWithIcon: [
		{ coinIcon: <></>, name: '비트코인', ticker: 'BTC', to: '/' },
	],
};

const Stub = createRoutesStub([
	{
		path: '/coin/:ticker',
		Component: () => (
			<StompProvider brokerURL="">
				<SideBar {...props} />
			</StompProvider>
		),
	},
]);

describe('SideBar 컴포넌트 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		props.onClose = vi.fn();
	});

	it('초기 상태에서 SideBar가 보여진다.', () => {
		render(<Stub initialEntries={['/coin/BTC']} />);

		const sideBar = screen.getByTestId('side-bar');

		expect(sideBar).toBeInTheDocument();
	});

	it('닫기 버튼을 클릭하면 onClose가 호출된다.', async () => {
		const user = userEvent.setup();
		render(<Stub initialEntries={['/coin/BTC']} />);

		const closeButton = screen.getByTestId('close-button');

		await user.click(closeButton);

		expect(props.onClose).toHaveBeenCalledTimes(1);
	});

	it('Backdrop을 누르면 onClose가 호출된다.', async () => {
		const user = userEvent.setup();
		render(<Stub initialEntries={['/coin/BTC']} />);

		const backdrop = screen.getByTestId('backdrop');

		await user.click(backdrop);

		expect(props.onClose).toHaveBeenCalledTimes(1);
	});
});
