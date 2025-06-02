import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CoinWithIconAndName from '.';

describe('CoinWithIconAndName 컴포넌트 테스트', () => {
	it('props로 전달된 name, ticker, coinIcon이 렌더링 된다 .', () => {
		const props = {
			name: '비트코인',
			ticker: 'BTC',
			coinIcon: <span>🪙</span>,
		};
		render(<CoinWithIconAndName {...props} />);

		const component = screen.getByTestId('coin-with-icon-and-name');
		expect(component).toBeInTheDocument();

		const coinIcon = screen.getByText('🪙');
		expect(coinIcon).toBeInTheDocument();

		const ticker = screen.getByText('BTC');
		expect(ticker).toBeInTheDocument();

		const name = screen.getByText('비트코인');
		expect(name).toBeInTheDocument();
	});
});
