import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { CurrentPriceData } from '~/entities/coin/hooks/useCurrentPrice';
import type { CoinListItemProps } from '.';
import CoinListItem from '.';

const props: CoinListItemProps = {
	name: '비트코인',
	ticker: 'BTC',
	to: '/coin/BTC',
	currentPrice: 0,
	changeRate: 0,
	svgIconBase64: '',
};

const Stub = createRoutesStub([
	{
		path: '/coin',
		Component: () => <CoinListItem {...props} />,
	},
]);

vi.mock('~/entities/coin', async () => {
	const actual =
		await vi.importActual<typeof import('~/entities/coin')>('~/entities/coin');

	return {
		...actual,
		useCurrentPrice: vi.fn().mockImplementation(
			(ticker): CurrentPriceData => ({
				changeRate: 0,
				currentPrice: 0,
				prevClose: 0,
				ticker,
				timestamp: '',
			}),
		),
	};
});

const { navigate } = vi.hoisted(() => ({
	navigate: vi.fn(),
}));

vi.mock('react-router', async () => {
	const actual =
		await vi.importActual<typeof import('react-router')>('react-router');
	return {
		...actual,
		useNavigate: () => navigate,
		createRoutesStub: actual.createRoutesStub,
	};
});

describe('CoinListItem 컴포넌트 테스트', () => {
	it('화면에 CoinListItem이 렌더링 된다.', () => {
		render(<Stub initialEntries={['/coin']} />);

		const coinListItem = screen.getByRole('button');
		expect(coinListItem).toBeInTheDocument();
	});

	it('사용자가 CoinListItem을 클릭하면 navigate가 호출된다.', async () => {
		const user = userEvent.setup();
		render(<Stub initialEntries={['/coin']} />);

		const coinListItem = screen.getByRole('button');
		expect(coinListItem).toBeInTheDocument();

		await user.click(coinListItem);

		expect(navigate).toHaveBeenCalledWith('/coin/BTC');
	});
});
