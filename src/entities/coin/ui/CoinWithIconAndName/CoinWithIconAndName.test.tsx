import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { convertBase64ToSvg } from '~/shared/utils';
import CoinWithIconAndName from '.';

const props = {
	name: '비트코인',
	ticker: 'BTC',
	svgIconBase64: 'testBase64String',
};
const FALLBACK_ICON = '🪙';

vi.mock('~/shared/utils', () => ({
	formatCurrencyKR: vi.fn((value) => value.toLocaleString()),
	convertBase64ToSvg: vi.fn((base64) => `data:image/svg+xml;base64,${base64}`),
}));

describe('CoinWithIconAndName 컴포넌트 테스트', () => {
	it('props로 전달된 name, ticker, coinIcon이 렌더링 된다 .', () => {
		render(<CoinWithIconAndName {...props} />);

		const component = screen.getByTestId('coin-with-icon-and-name');
		expect(component).toBeInTheDocument();

		const coinIcon = screen.getByRole('img');
		expect(coinIcon).toBeInTheDocument();

		const ticker = screen.getByText(props.ticker);
		expect(ticker).toBeInTheDocument();

		const name = screen.getByText(props.name);
		expect(name).toBeInTheDocument();
	});

	it('svgIconBase64가 제공되지 않으면 대체 아이콘이 보인다', () => {
		const propsWithoutIcon = {
			...props,
			svgIconBase64: undefined,
		};

		render(<CoinWithIconAndName {...propsWithoutIcon} />);

		const fallbackIcon = screen.getByText(FALLBACK_ICON);
		expect(fallbackIcon).toBeInTheDocument();
	});

	it('svgIconBase64가 제공되면 이미지가 렌더링된다', () => {
		render(<CoinWithIconAndName {...props} />);

		const image = convertBase64ToSvg(props.svgIconBase64);
		const imgElement = screen.getByRole('img');

		expect(imgElement).toBeInTheDocument();
		expect(imgElement).toHaveAttribute('alt', props.name);
		expect(imgElement).toHaveAttribute('src', image);
		expect(convertBase64ToSvg).toHaveBeenCalledWith(props.svgIconBase64);
	});
});
