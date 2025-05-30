import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import QuantityInput from '.';

const initialProps = {
	value: undefined,
	onClickPlus: vi.fn(),
	onClickMinus: vi.fn(),
};

describe('QuantityInput 컴포넌트 테스트', () => {
	it('금액을 입력하면 해당 금액이 화면에 보인다.', async () => {
		const user = userEvent.setup();

		render(<QuantityInput {...initialProps} />);

		const input = screen.getByRole('spinbutton');

		await act(async () => {
			await user.type(input, '1000');
		});

		expect(input).toHaveValue(1000);
	});

	it('plus 버튼을 클릭하면 onClickPlus가 호출된다.', async () => {
		const user = userEvent.setup();

		render(<QuantityInput {...initialProps} />);

		const plusButton = screen.getByTestId('plus-button');

		await user.click(plusButton);

		expect(initialProps.onClickPlus).toHaveBeenCalledTimes(1);
	});

	it('minus 버튼을 클릭하면 onClickMinus가 호출된다.', async () => {
		const user = userEvent.setup();

		render(<QuantityInput {...initialProps} />);

		const minusButton = screen.getByTestId('minus-button');

		await user.click(minusButton);

		expect(initialProps.onClickMinus).toHaveBeenCalledTimes(1);
	});
});
