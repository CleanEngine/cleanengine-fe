import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import NumberInput from '.';

describe('NumberInput 컴포넌트 테스트', () => {
	it('사용자가 숫자를 입력하면 onChange 이벤트가 발생한다.', async () => {
		const onChange = (e: ChangeEvent<HTMLInputElement>) => {};
		const onChangeSpy = vi.fn(onChange);
		render(<NumberInput onChange={onChangeSpy} />);
		const input = screen.getByRole('spinbutton');

		const user = userEvent.setup();
		await user.type(input, '123');

		expect(onChangeSpy).toHaveBeenCalled();
		expect(onChangeSpy.mock.calls[0][0].target.value).toBe('123');
	});

	it('숫자가 아닌 문자를 입력하면 값이 변경되지 않는다', async () => {
		const onChangeSpy = vi.fn();
		render(<NumberInput onChange={onChangeSpy} />);
		const input = screen.getByRole('spinbutton');

		const user = userEvent.setup();
		await user.type(input, 'abc');

		expect(input).toHaveValue(null);
	});
});
