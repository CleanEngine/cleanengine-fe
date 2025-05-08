import { type ChangeEvent, useState } from 'react';

import QuantityInput from '~/entities/order/ui/QuantityInput';
import Switch from '~/shared/ui/Switch';
import { isNegative, isUndefined } from '~/shared/utils';
import { PRICE_STEP, QUANTITY_STEP } from '../../const';
import type { OrderType } from '../../types';

export default function OrderForm() {
	const [orderType, setOrderType] = useState<OrderType>('지정가');
	const [price, setPrice] = useState<number | undefined>();
	const [quantity, setQuantity] = useState<number | undefined>();

	const totalPrice = (price || 0) * (quantity || 0);

	const handleOrderTypeChange = (orderType: OrderType) => {
		setOrderType(orderType);
	};

	const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPrice(Number(event.target.value));
	};

	const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
		setQuantity(Number(event.target.value));
	};

	const handlePriceMinus = () => {
		setPrice((prevPrice) => {
			if (isUndefined(prevPrice)) return undefined;

			const nextPrice = prevPrice - PRICE_STEP;
			if (isNegative(nextPrice)) return prevPrice;

			return nextPrice;
		});
	};

	const handlePricePlus = () => {
		setPrice((prevPrice) =>
			!isUndefined(prevPrice) ? prevPrice + PRICE_STEP : undefined,
		);
	};

	const handleQuantityMinus = () => {
		setQuantity((prevQuantity) => {
			if (isUndefined(prevQuantity)) return undefined;

			const nextQuantity = prevQuantity - QUANTITY_STEP;
			if (isNegative(nextQuantity)) return prevQuantity;

			return nextQuantity;
		});
	};

	const handleQuantityPlus = () => {
		setQuantity((prevQuantity) =>
			!isUndefined(prevQuantity) ? prevQuantity + QUANTITY_STEP : undefined,
		);
	};

	// TODO: API 연결하기
	const handleSubmit = () => {};

	return (
		<form className="flex flex-col gap-2 pt-2 text-base">
			<div className="flex items-center">
				<span className="flex-1">구매 가격</span>
				<div className="flex-2">
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
				<span className="flex-1" />
				<div className="flex-2">
					<QuantityInput
						disabled={orderType === '시장가'}
						placeholder={
							orderType === '시장가' ? '최대한 빠른 가격' : '가격 입력'
						}
						onClickMinus={handlePriceMinus}
						onClickPlus={handlePricePlus}
						onChange={handlePriceChange}
						step={PRICE_STEP}
						value={price}
						min={0}
					/>
				</div>
			</div>
			<div className="flex">
				<span className="flex-1">수량</span>
				<div className="flex-2">
					<QuantityInput
						placeholder="수량 입력"
						onClickMinus={handleQuantityMinus}
						onClickPlus={handleQuantityPlus}
						step={QUANTITY_STEP}
						onChange={handleQuantityChange}
						value={quantity}
						min={0}
					/>
				</div>
			</div>
			<div className="my-3 h-[1px] w-full bg-gray-200" />
			<div className="flex flex-col gap-2">
				<div className="flex items-stretch font-medium text-sm">
					<span className="flex-1 text-left">구매가능 금액</span>
					<span className="flex-1 text-right">{totalPrice}원</span>
				</div>
				<div className="flex items-stretch font-medium text-sm">
					<span className="flex-1 text-left">총 주문 금액</span>
					<span className="flex-1 text-right">{totalPrice}원</span>
				</div>
			</div>
			<button
				type="button"
				className="mt-4 cursor-pointer rounded-lg bg-red-500 py-1.5 text-white hover:opacity-80 active:opacity-90"
			>
				주문하기
			</button>
		</form>
	);
}
