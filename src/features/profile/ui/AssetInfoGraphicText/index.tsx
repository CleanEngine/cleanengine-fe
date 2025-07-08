import clsx from 'clsx';
import IncrementingNumber from '~/shared/ui/IncrementingNumber';

type AssetInfoGraphicTextProps = {
	label: string;
	type: 'money' | 'percent';
	value: number;
};

export default function AssetInfoGraphicText({
	label,
	type,
	value,
}: AssetInfoGraphicTextProps) {
	const valueUnit = type === 'money' ? '원' : '%';
	const color =
		value > 0 ? 'text-red-500' : value < 0 ? 'text-blue-500' : 'text-gray-800';
	const valueTextClassName = type === 'percent' ? color : '';

	return (
		<div>
			<p className="font-semibold text-gray-500 text-md">{label}</p>
			<p
				className={clsx(
					'font-semibold text-gray-800 text-xl',
					valueTextClassName,
				)}
			>
				<IncrementingNumber formatToCurrencyKr duration={3}>
					{value}
				</IncrementingNumber>
				{valueUnit}
			</p>
		</div>
	);
}
