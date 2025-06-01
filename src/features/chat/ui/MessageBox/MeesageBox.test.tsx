import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MessageBox from '.';

describe('MessageBox 컴포넌트 테스트', () => {
	it('prop으로 전달된 message가 화면에 보여진다.', () => {
		render(<MessageBox direction="left" message="test" />);

		const messageBox = screen.getByTestId('message-box');

		expect(messageBox).toBeInTheDocument();
		expect(messageBox).toHaveTextContent('test');
	});

	it('direction이 left일 때 justify-items가 start이다.', () => {
		render(<MessageBox direction="left" message="test" />);

		const messageBox = screen.getByTestId('message-box');

		expect(messageBox).toBeInTheDocument();
		expect(messageBox).toHaveClass('justify-start');
	});

	it('direction이 right일 때 justify-items가 end이다.', () => {
		render(<MessageBox direction="right" message="test" />);

		const messageBox = screen.getByTestId('message-box');

		expect(messageBox).toBeInTheDocument();
		expect(messageBox).toHaveClass('justify-end');
	});
});
