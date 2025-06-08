import { IconXmark } from '~/assets/svgs';

type CloseButtonProps = {
	onClick: () => void;
};

export default function CloseButton({ onClick }: Readonly<CloseButtonProps>) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="aspect-auto w-4 cursor-pointer"
			data-testid="close-button"
		>
			<IconXmark />
		</button>
	);
}
