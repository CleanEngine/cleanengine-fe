import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContainerTitle from '.';

describe('ContainerTitle 컴포넌트 테스트', () => {
	it('props로 전달된 string이 렌더링 된다.', () => {
		const text = 'title';
		render(<ContainerTitle>{text}</ContainerTitle>);

		expect(screen.getByText('title')).toBeInTheDocument();
	});
});
