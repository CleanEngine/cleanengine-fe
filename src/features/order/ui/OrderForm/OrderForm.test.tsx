import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import OrderForm from '.';
import { PRICE_STEP, QUANTITY_STEP } from '../../const';

describe('OrderForm 테스트', () => {
	it('OrderForm이 화면에 렌더링된다.', () => {
		render(<OrderForm ticker="BTC" />);

		const form = screen.getByRole('form');

		expect(form).toBeInTheDocument();
	});

	it('처음에는 매수, 지정가로 화면에 렌더링되며 사용자는 가격과 수량을 입력할 수 있다.', async () => {
		const user = userEvent.setup();
		render(<OrderForm ticker="BTC" />);

		const form = screen.getByRole('form');

		expect(form).toBeInTheDocument();
		expect(screen.getByText('매수')).toBeInTheDocument();
		expect(screen.getByText('지정가')).toBeInTheDocument();

		const priceInput = screen.getByPlaceholderText('가격 입력');
		const quantityInput = screen.getByPlaceholderText('수량 입력');

		expect(priceInput).toBeInTheDocument();
		expect(quantityInput).toBeInTheDocument();

		await user.type(priceInput, '100000');
		await user.type(quantityInput, '1');

		expect(priceInput).toHaveValue(100000);
		expect(quantityInput).toHaveValue(1);
	});

	it('사용자는 매수, 시장가로 변경할 수 있으며 사용자는 수량만 입력할 수 있다.', async () => {
		const user = userEvent.setup();
		render(<OrderForm ticker="BTC" />);

		const form = screen.getByRole('form');

		expect(form).toBeInTheDocument();

		const switchButton = screen.getByRole('button', { name: '지정가' });

		expect(switchButton).toBeInTheDocument();

		await user.click(switchButton);

		const priceInput = screen.getByPlaceholderText('가격 입력');
		const quantityInput = screen.getByPlaceholderText('가능한 수량');

		expect(priceInput).toBeInTheDocument();
		expect(quantityInput).toBeInTheDocument();
		expect(quantityInput).toBeDisabled();

		await user.type(priceInput, '1');

		expect(priceInput).toHaveValue(1);
	});

	it('사용자는 매도, 지정가로 변경할 수 있으며 사용자는 수량만 입력할 수 있다.', async () => {
		const user = userEvent.setup();
		render(<OrderForm ticker="BTC" />);

		const form = screen.getByRole('form');

		expect(form).toBeInTheDocument();

		const switchButton = screen.getByRole('button', { name: '매수' });

		expect(switchButton).toBeInTheDocument();

		await user.click(switchButton);

		const priceInput = screen.getByPlaceholderText('가격 입력');
		const quantityInput = screen.getByPlaceholderText('수량 입력');

		expect(priceInput).toBeInTheDocument();
		expect(quantityInput).toBeInTheDocument();

		await user.type(priceInput, '1000');
		await user.type(quantityInput, '1');

		expect(priceInput).toHaveValue(1000);
		expect(quantityInput).toHaveValue(1);
	});

	it('사용자는 매도, 시장가로 변경할 수 있으며 사용자는 수량만 입력할 수 있다.', async () => {
		const user = userEvent.setup();
		render(<OrderForm ticker="BTC" />);

		const form = screen.getByRole('form');

		expect(form).toBeInTheDocument();

		const switchTradeTypeButton = screen.getByRole('button', { name: '매수' });
		const switchOrderTypeButton = screen.getByRole('button', {
			name: '시장가',
		});

		expect(switchTradeTypeButton).toBeInTheDocument();
		expect(switchOrderTypeButton).toBeInTheDocument();

		await user.click(switchTradeTypeButton);
		await user.click(switchOrderTypeButton);

		const priceInput = screen.getByPlaceholderText('최대한 빠른 가격');
		const quantityInput = screen.getByPlaceholderText('수량 입력');

		expect(priceInput).toBeInTheDocument();
		expect(quantityInput).toBeInTheDocument();
		expect(priceInput).toBeDisabled();

		await user.type(quantityInput, '1');

		expect(quantityInput).toHaveValue(1);
	});

	it('input의 버튼을 클릭하면 input의 값이 increment되거나 decrement된다.', async () => {
		const user = userEvent.setup();
		render(<OrderForm ticker="BTC" />);

		const form = screen.getByRole('form');

		expect(form).toBeInTheDocument();

		const priceInput = screen.getByTestId('price-input');
		const quantityInput = screen.getByTestId('quantity-input');

		expect(priceInput).toBeInTheDocument();
		expect(quantityInput).toBeInTheDocument();

		await user.type(priceInput, '1');
		await user.type(quantityInput, '1');

		expect(priceInput).toHaveValue(1);
		expect(quantityInput).toHaveValue(1);

		const plusButtons = screen.getAllByTestId('plus-button');
		const minusButtons = screen.getAllByTestId('minus-button');

		await user.click(plusButtons[0]);
		await user.click(plusButtons[1]);

		expect(priceInput).toHaveValue(1 + PRICE_STEP);
		expect(quantityInput).toHaveValue(1 + QUANTITY_STEP);

		await user.click(minusButtons[0]);
		await user.click(minusButtons[1]);

		expect(priceInput).toHaveValue(1);
		expect(quantityInput).toHaveValue(1);
	});
});
