import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CloudImage from '~/assets/images/cloud.webp';

import '../../hooks/useCurrentPrice';
import CoinPriceWithName from '.';

const mockPriceData = {
	changeRate: 4,
	currentPrice: 100_000_000,
	prevClose: 100_000_000,
	ticker: 'BTC',
	timestamp: '2025-05-30T15:00:00.000Z',
};

vi.mock('../../hooks/useCurrentPrice', () => ({
	default: vi.fn().mockImplementation((ticker) => {
		return mockPriceData;
	}),
}));

describe('CoinPriceWithName 컴포넌트 테스트', () => {
	it('name과 ticker과 img가 prop으로 전달되면 화면에 보인다', () => {
		const props = {
			name: '비트코인',
			ticker: 'BTC',
			img: CloudImage,
		};
		render(<CoinPriceWithName {...props} />);

		const name = screen.getByText('비트코인');
		const ticker = screen.getByText('BTC');
		const img = screen.getByRole('img');

		expect(name).toBeInTheDocument();
		expect(ticker).toBeInTheDocument();
		expect(img).toBeInTheDocument();
	});

	it('img가 prop으로 전달되지 않으면 대체 아이콘이 보인다', () => {
		const props = {
			name: '비트코인',
			ticker: 'BTC',
			img: undefined,
		};
		render(<CoinPriceWithName {...props} />);

		const img = screen.getByText('🪙');
		expect(img).toBeInTheDocument();
	});

	it('ticker가 주어지면 해당하는 코인의 가격이 한국의 원화 형식에 맞게 화면에 보인다.', () => {
		const props = {
			name: '비트코인',
			ticker: 'BTC',
			img: CloudImage,
		};
		render(<CoinPriceWithName {...props} />);

		const price = screen.getByText('100,000,000원');
		expect(price).toBeInTheDocument();
	});
});
