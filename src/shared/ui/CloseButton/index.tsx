import { IconXmark } from '~/assets/svgs';

type CloseButtonProps = {
	onClick: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="aspect-auto w-4 cursor-pointer"
		>
			<IconXmark />
		</button>
	);
}
