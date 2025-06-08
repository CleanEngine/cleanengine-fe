import { IconBars } from '~/assets/svgs';

export type MenuButtonProps = {
	onClick: () => void;
};

export default function MenuButton({ onClick }: MenuButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="aspect-auto w-4 cursor-pointer"
			data-testid="menu-button"
		>
			<IconBars />
		</button>
	);
}
