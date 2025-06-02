import { useMachine } from '@xstate/react';
import { type ChangeEvent, type FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify/unstyled';

import { QuantityInput } from '~/entities/order';
import Switch from '~/shared/ui/Switch';
import { formatCurrencyKR, preventNonNumericInput } from '~/shared/utils';
import { PRICE_STEP, QUANTITY_STEP } from '../../const';
import { formMachine } from '../../models/form.machine';

type OrderFormProps = {
	ticker: string;
};

export default function OrderForm({ ticker }: OrderFormProps) {
	const [state, send, actorRef] = useMachine(formMachine, {
		input: {
			ticker,
		},
	});

	const priceLabel =
		state.context.tradeType === '매수' ? '구매 가격' : '판매 가격';
	const quantityLabel =
		state.context.tradeType === '매수' ? '구매가능 금액' : '매도가능 수량';
	const quantityValueText =
		state.context.tradeType === '매수'
			? `${formatCurrencyKR(state.context.deposit || 0)}원`
			: `${state.context.holdings?.toFixed(2) || 0}개`;
	const totalOrderPriceText =
		state.context.tradeType === '매수'
			? state.context.orderType === '지정가'
				? `${formatCurrencyKR((state.context.price || 0) * (state.context.quantity || 0))}원`
				: '시장가격에 매수'
			: state.context.orderType === '지정가'
				? `${formatCurrencyKR((state.context.price || 0) * (state.context.quantity || 0))}원`
				: '시장가격에 매도';

	const handleTradeTypeChange = () => {
		send({ type: 'SWITCH_TRADE_TYPE' });
	};

	const handleOrderTypeChange = () => {
		send({ type: 'SWITCH_ORDER_TYPE' });
	};

	const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;

		const price = Number(value);
		send({ type: 'CHANGE_PRICE', price });
	};

	const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value;

		const quantity = Number(value);
		send({ type: 'CHANGE_QUANTITY', quantity });
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

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		send({ type: 'SUBMIT_FORM' });
	};

	useEffect(() => {
		const subscription = actorRef.subscribe((snapshot) => {
			if (
				snapshot.value !== 'Showing Error Message' &&
				snapshot.value !== 'Showing Success Message'
			)
				return;
			const toastMessage =
				snapshot.value === 'Showing Error Message'
					? toast.error
					: toast.success;
			toastMessage(snapshot.context.message);
		});

		return subscription.unsubscribe;
	}, [actorRef]);

	return (
		<form
			className="scrollbar-custom flex flex-col gap-2 overflow-y-scroll pt-2 text-base"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col items-stretch gap-2">
				<div className="items-stretch">
					<Switch
						value1="매수"
						value2="매도"
						text1="매수"
						text2="매도"
						selected={state.context.tradeType}
						onChange={handleTradeTypeChange}
					/>
				</div>
				<div className="items-stretch">
					<Switch
						value1="지정가"
						value2="시장가"
						text1="지정가"
						text2="시장가"
						selected={state.context.orderType}
						onChange={handleOrderTypeChange}
					/>
				</div>
			</div>
			<div className="flex items-center">
				<span className="flex-1">{priceLabel}</span>
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
						onKeyDown={preventNonNumericInput}
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
						onKeyDown={preventNonNumericInput}
					/>
				</div>
			</div>
			<div className="my-3 h-[1px] w-full bg-gray-200" />
			<div className="flex flex-col gap-2">
				<div className="flex items-stretch font-medium text-sm">
					<span className="flex-1 text-left">{quantityLabel}</span>
					<span className="flex-1 text-right">{quantityValueText}</span>
				</div>
				<div className="flex items-stretch font-medium text-sm">
					<span className="flex-1 text-left">총 주문 금액</span>
					<span className="flex-1 text-right">{totalOrderPriceText}</span>
				</div>
			</div>
			<button
				type="submit"
				className="mt-2 cursor-pointer rounded-lg bg-red-500 py-1.5 text-white hover:opacity-80 active:opacity-90"
			>
				주문하기
			</button>
			{state.context.message}
		</form>
	);
}
