import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Switch from '.';

const SWITCH_PROPS = {
	value1: 'value1',
	value2: 'value2',
	text1: 'text1',
	text2: 'text2',
	selected: 'value1',
	onChange: vi.fn(),
};

describe('Switch 컴포넌트 테스트', () => {
	beforeEach(() => {
		render(<Switch {...SWITCH_PROPS} />);
	});

	it('Switch에 props로 전달된 text1과 text2가 렌더링 된다.', async () => {
		const text1 = screen.getByText(SWITCH_PROPS.text1);
		const text2 = screen.getByText(SWITCH_PROPS.text2);

		expect(text1).toBeInTheDocument();
		expect(text2).toBeInTheDocument();
	});

	it('Switch에 props로 전달된 value1과 value2가 렌더링 된다.', async () => {
		const switchButton1 = screen.getByTestId('switch-button-1');
		const switchButton2 = screen.getByTestId('switch-button-2');

		expect(switchButton1).toHaveValue(SWITCH_PROPS.value1);
		expect(switchButton2).toHaveValue(SWITCH_PROPS.value2);
	});

	it('Switch를 누르면 해당 값이 선택된다.', async () => {
		const user = userEvent.setup();

		await user.click(screen.getByTestId('switch-button-1'));
		expect(SWITCH_PROPS.onChange).toHaveBeenCalledWith(SWITCH_PROPS.value1);

		await user.click(screen.getByTestId('switch-button-2'));
		expect(SWITCH_PROPS.onChange).toHaveBeenCalledWith(SWITCH_PROPS.value2);
	});

	it('같은 버튼을 연속으로 클릭할 수 있다.', async () => {
		const user = userEvent.setup();

		await user.click(screen.getByTestId('switch-button-1'));
		expect(SWITCH_PROPS.onChange).toHaveBeenCalledWith(SWITCH_PROPS.value1);

		await user.click(screen.getByTestId('switch-button-1'));
		expect(SWITCH_PROPS.onChange).toHaveBeenCalledWith(SWITCH_PROPS.value1);
	});
});
