import { IconMinus, IconPlus } from '~/assets/svgs';
import NumberInput, { type NumberInputProps } from '~/shared/ui/NumberInput';

export type PriceQuantityInputProps = {
	onClickPlus: VoidFunction;
	onClickMinus: VoidFunction;
} & NumberInputProps;

export default function PriceQuantityInput({
	onClickPlus,
	onClickMinus,
	...props
}: PriceQuantityInputProps) {
	return (
		<div className="relative">
			<NumberInput
				placeholder="주문금액"
				step={1000}
				min={0}
				{...props}
				style={{ paddingRight: '4rem' }}
			/>
			<button
				type="button"
				onClick={onClickPlus}
				className="-translate-y-1/2 absolute top-1/2 right-1 w-7 cursor-pointer rounded-sm p-1.5 px-2 hover:bg-gray-200 disabled:cursor-not-allowed"
				disabled={props.disabled}
			>
				<IconPlus className="fill-gray-500" />
			</button>
			<button
				type="button"
				onClick={onClickMinus}
				className="-translate-y-1/2 absolute top-1/2 right-8 w-7 cursor-pointer rounded-sm p-1.5 px-2 hover:bg-gray-200 disabled:cursor-not-allowed"
				disabled={props.disabled}
			>
				<IconMinus className="fill-gray-500" />
			</button>
		</div>
	);
}
