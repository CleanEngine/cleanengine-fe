import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { CurrentPriceData } from '~/entities/coin/hooks/useCurrentPrice';
import type { CoinListItemProps } from '.';
import CoinListItem from '.';

const props: CoinListItemProps = {
	name: '비트코인',
	ticker: 'BTC',
	coinIcon: <span>🪙</span>,
	to: '/coin/BTC',
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

describe('CoinListItem 컴포넌트 테스트', () => {
	it('화면에 CoinListItem이 렌더링 된다.', () => {
		render(<Stub initialEntries={['/coin']} />);

		const coinListItem = screen.getByRole('link');
		expect(coinListItem).toBeInTheDocument();
	});

	it('Link의 to 속성으로 prop의 to가 전달된다.', () => {
		render(<Stub initialEntries={['/coin']} />);

		const coinListItem = screen.getByRole('link');

		expect(coinListItem).toBeInTheDocument();
		expect(coinListItem).toHaveAttribute('href', '/coin/BTC');
	});
});
