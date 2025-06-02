import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Logo from '.';

import CloudLogoBlack from '~/assets/images/cloud-black.webp';
import CloudLogo from '~/assets/images/cloud.webp';

describe('Logo 컴포넌트 테스트', () => {
	it('isBlack이 true일 때 블랙 로고가 렌더링 된다.', () => {
		render(<Logo isBlack />);
		const logo = screen.getByRole('img');

		expect(logo).toHaveAttribute('src', CloudLogoBlack);
	});

	it('isBlack이 false일 때 흰색 로고가 렌더링 된다.', () => {
		render(<Logo />);
		const logo = screen.getByRole('img');

		expect(logo).toHaveAttribute('src', CloudLogo);
	});
});
