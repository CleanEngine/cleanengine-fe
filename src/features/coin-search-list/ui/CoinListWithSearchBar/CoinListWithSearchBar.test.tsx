import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import userEvent from '@testing-library/user-event';
import StompProvider from '~/app/provider/StompProvider';
import type { CoinListWithSearchBarProps } from '.';
import CoinListWithSearchBar from '.';

vi.mock('@stomp/stompjs', () => {
	return {
		Client: vi.fn().mockImplementation(() => {
			return {
				activate: vi.fn(),
				deactivate: vi.fn(),
				onConnect: null,
				onDisconnect: null,
				onWebSocketError: null,
				onStompError: null,
			};
		}),
	};
});

const props: CoinListWithSearchBarProps = {
	coinList: [
		{
			coinIcon: <span>🪙</span>,
			name: '비트코인',
			ticker: 'BTC',
			to: '/coin/BTC',
		},
		{
			coinIcon: <span>🪙</span>,
			name: '이더리움',
			ticker: 'ETH',
			to: '/coin/ETH',
		},
		{
			coinIcon: <span>🪙</span>,
			name: '트럼프',
			ticker: 'TRUMP',
			to: '/coin/TRUMP',
		},
	],
};

const Stub = createRoutesStub([
	{
		path: '/coin/:ticker',
		Component: () => (
			<StompProvider brokerURL="">
				<CoinListWithSearchBar {...props} />
			</StompProvider>
		),
	},
]);

describe('CoinListWithSearchBar 컴포넌트 테스트', () => {
	it('화면에 CoinListWithSearchBar가 렌더링 된다.', () => {
		render(<Stub initialEntries={['/coin/BTC']} />);

		const coinListWithSearchBar = screen.getByTestId(
			'coin-list-with-search-bar',
		);

		expect(coinListWithSearchBar).toBeInTheDocument();
		expect(screen.getAllByRole('link')).toHaveLength(3);
	});

	it('사용자가 검색창에 티커를 입력하면 필터링된 리스트가 렌더링 된다.', async () => {
		const user = userEvent.setup();
		render(<Stub initialEntries={['/coin/BTC']} />);

		const coinListWithSearchBar = screen.getByTestId(
			'coin-list-with-search-bar',
		);

		expect(coinListWithSearchBar).toBeInTheDocument();

		const input = screen.getByRole('textbox');
		await user.type(input, 'BTC');

		expect(screen.getAllByRole('link')).toHaveLength(1);
		expect(screen.getAllByRole('link')[0]).toHaveTextContent('비트코인');
	});
});
