import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LogoWithTitle from '.';

describe('LogoWithTitle 컴포넌트 테스트', () => {
	it('props로 전달된 serviceName이 렌더링 된다.', () => {
		render(<LogoWithTitle serviceName="서비스" />);

		const component = screen.getByRole('heading');

		expect(component).toHaveTextContent('서비스');
	});
});
