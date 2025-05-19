import type { ChangeEvent, FormEvent } from 'react';

import { useMachine } from '@xstate/react';
import { QuantityInput } from '~/entities/order';
import Switch from '~/shared/ui/Switch';
import { formatCurrencyKR } from '~/shared/utils';
import { PRICE_STEP, QUANTITY_STEP } from '../../const';
import { formMachine } from '../../models/form.machine';
import type { OrderType, TradeType } from '../../types/order.endpoint';

export default function OrderForm() {
	const [state, send] = useMachine(formMachine, {});
	const quantityLabel =
		state.context.tradeType === '매수' ? '구매가능 금액' : '매도가능 수량';
	const quantityValue =
		state.context.tradeType === '매수'
			? `${formatCurrencyKR(state.context.deposit || 0)}원`
			: `${state.context.holdings || 0}개`;
	const totalOrderPrice =
		state.context.tradeType === '매수'
			? state.context.orderType === '지정가'
				? `${formatCurrencyKR((state.context.price || 0) * (state.context.quantity || 0))}원`
				: '시장가격에 매수'
			: state.context.orderType === '지정가'
				? `${formatCurrencyKR((state.context.price || 0) * (state.context.quantity || 0))}원`
				: '시장가격에 매도';

	const handleTradeTypeChange = (tradeType: TradeType) => {
		send({ type: 'SWITCH_TRADE_TYPE', tradeType });
	};

	const handleOrderTypeChange = (orderType: OrderType) => {
		send({ type: 'SWITCH_ORDER_TYPE', orderType });
	};

	const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
		const price = Number(event.target.value);
		send({ type: 'CHANGE_BUY_PRICE', price });
	};

	const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
		const quantity = Number(event.target.value);
		send({ type: 'CHANGE_BUY_QUANTITY', quantity });
	};

	const handlePriceMinus = () => {
		send({ type: 'DECREMENT_PRICE' });
	};

	const handlePricePlus = () => {
		send({ type: 'INCREMENT_PRICE' });
	};

	const handleQuantityMinus = () => {
		send({ type: 'DECREMENT_QUANTITY' });
	};

	const handleQuantityPlus = () => {
		send({ type: 'INCREMENT_QUANTITY' });
	};

	// TODO: API 연결하기
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		send({ type: 'SUBMIT_FORM' });
	};

	return (
		<form
			className="flex flex-col gap-2 pt-2 text-base"
			onSubmit={handleSubmit}
		>
			<Switch
				value1="매수"
				value2="매도"
				text1="매수"
				text2="매도"
				onChange={handleTradeTypeChange}
			/>
			<div className="flex items-center">
				<div className="flex-1">
					<Switch
						value1="지정가"
						value2="시장가"
						text1="지정가"
						text2="시장가"
						onChange={handleOrderTypeChange}
					/>
				</div>
			</div>
			<div className="flex items-center">
				<span className="flex-1">구매 가격</span>
				<div className="flex-2">
					<QuantityInput
						disabled={
							state.context.tradeType === '매도' &&
							state.context.orderType === '시장가'
						}
						placeholder={
							state.context.tradeType === '매도' &&
							state.context.orderType === '시장가'
								? '최대한 빠른 가격'
								: '가격 입력'
						}
						onClickMinus={handlePriceMinus}
						onClickPlus={handlePricePlus}
						onChange={handlePriceChange}
						step={PRICE_STEP}
						value={(state.context.price || '').toString()}
						min={0}
					/>
				</div>
			</div>
			<div className="flex">
				<span className="flex-1">수량</span>
				<div className="flex-2">
					<QuantityInput
						disabled={
							state.context.tradeType === '매수' &&
							state.context.orderType === '시장가'
						}
						placeholder={
							state.context.tradeType === '매수' &&
							state.context.orderType === '시장가'
								? '가능한 수량'
								: '수량 입력'
						}
						onClickMinus={handleQuantityMinus}
						onClickPlus={handleQuantityPlus}
						step={QUANTITY_STEP}
						onChange={handleQuantityChange}
						value={(state.context.quantity || '').toString()}
						min={0}
					/>
				</div>
			</div>
			<div className="my-3 h-[1px] w-full bg-gray-200" />
			<div className="flex flex-col gap-2">
				<div className="flex items-stretch font-medium text-sm">
					<span className="flex-1 text-left">{quantityLabel}</span>
					<span className="flex-1 text-right">{quantityValue}</span>
				</div>
				<div className="flex items-stretch font-medium text-sm">
					<span className="flex-1 text-left">총 주문 금액</span>
					<span className="flex-1 text-right">{totalOrderPrice}</span>
				</div>
			</div>
			<button
				type="submit"
				className="mt-4 cursor-pointer rounded-lg bg-red-500 py-1.5 text-white hover:opacity-80 active:opacity-90"
			>
				주문하기
			</button>
			{state.context.errorMessage}
		</form>
	);
}
