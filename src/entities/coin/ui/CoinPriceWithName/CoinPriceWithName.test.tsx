import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import '../../hooks/useCurrentPrice';
import { convertBase64ToSvg, formatCurrencyKR } from '~/shared/utils';
import CoinPriceWithName from '.';
import useCurrentPrice from '../../hooks/useCurrentPrice';

const props = {
	name: '비트코인',
	ticker: 'BTC',
	currentPrice: 9_000_000,
};

const FALLBACK_ICON = '🪙';

const mockPriceData = {
	changeRate: 4,
	currentPrice: 100_000_000,
	prevClose: 100_000_000,
	ticker: 'BTC',
	timestamp: '2025-05-30T15:00:00.000Z',
};

vi.mock('../../hooks/useCurrentPrice', () => ({
	default: vi.fn(),
}));

vi.mock('~/shared/utils', () => ({
	formatCurrencyKR: vi.fn((value) => value.toLocaleString()),
	convertBase64ToSvg: vi.fn((base64) => `data:image/svg+xml;base64,${base64}`),
}));

const mockUseCurrentPrice = vi.mocked(useCurrentPrice);

describe('CoinPriceWithName 컴포넌트 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('name과 ticker과 img가 prop으로 전달되면 화면에 보인다', () => {
		mockUseCurrentPrice.mockReturnValue(null);

		render(<CoinPriceWithName {...props} />);

		const name = screen.getByText(props.name);
		const ticker = screen.getByText(props.ticker);

		expect(name).toBeInTheDocument();
		expect(ticker).toBeInTheDocument();
	});

	it('웹소켓이 연결되지 않으면 props로 전달된 가격이 보인다.', () => {
		mockUseCurrentPrice.mockReturnValue(null);

		render(<CoinPriceWithName {...props} />);

		const price = screen.getByText(`${formatCurrencyKR(props.currentPrice)}원`);
		expect(price).toBeInTheDocument();
	});

	it('웹소켓이 연결되지 않으면 props로 전달된 가격이 보이다가 웹소켓이 연결되면 실시간 가격이 보인다.', () => {
		mockUseCurrentPrice.mockReturnValue(null);

		const { rerender } = render(<CoinPriceWithName {...props} />);

		const price = screen.getByText(`${formatCurrencyKR(props.currentPrice)}원`);
		expect(price).toBeInTheDocument();

		mockUseCurrentPrice.mockReturnValue(mockPriceData);

		rerender(<CoinPriceWithName {...props} />);
		const realTimePrice = screen.getByText(
			`${formatCurrencyKR(mockPriceData.currentPrice)}원`,
		);
		expect(realTimePrice).toBeInTheDocument();
	});

	it('props로 가격이 전달되지 않고 웹소켓이 연결되지 않으면 가격이 0으로 보인다', () => {
		mockUseCurrentPrice.mockReturnValue(null);
		const propsWithoutPrice = {
			...props,
			currentPrice: null,
		};

		render(<CoinPriceWithName {...propsWithoutPrice} />);

		const price = screen.getByText('0원');
		expect(price).toBeInTheDocument();
	});

	it('svgIconBase64가 제공되지 않으면 대체 아이콘이 보인다', () => {
		mockUseCurrentPrice.mockReturnValue(null);

		render(<CoinPriceWithName {...props} />);

		const fallbackIcon = screen.getByText(FALLBACK_ICON);
		expect(fallbackIcon).toBeInTheDocument();
	});

	it('svgIconBase64가 제공되면 이미지가 렌더링된다', () => {
		mockUseCurrentPrice.mockReturnValue(null);
		const mockBase64 = 'testBase64String';
		const propsWithIcon = {
			...props,
			svgIconBase64: mockBase64,
		};

		render(<CoinPriceWithName {...propsWithIcon} />);

		const img = screen.getByRole('img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('alt', props.name);
		expect(img).toHaveAttribute(
			'src',
			`data:image/svg+xml;base64,${mockBase64}`,
		);
		expect(convertBase64ToSvg).toHaveBeenCalledWith(mockBase64);
	});
});
