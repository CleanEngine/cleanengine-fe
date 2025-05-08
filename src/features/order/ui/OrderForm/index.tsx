import { type ChangeEvent, useState } from 'react';

import QuantityInput from '~/entities/order/ui/QuantityInput';
import { isNegative, isUndefined } from '~/shared/utils';
import { PRICE_STEP, QUANTITY_STEP } from '../../const';

export default function OrderForm() {
	const [price, setPrice] = useState<number | undefined>();
	const [quantity, setQuantity] = useState<number | undefined>();

	const totalPrice = (price || 0) * (quantity || 0);

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

	return (
		<form className="flex flex-col gap-2 pt-2 text-base">
			<div className="flex items-center">
				<span className="flex-1">구매 가격</span>
				<div className="flex-2">
					<QuantityInput
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
