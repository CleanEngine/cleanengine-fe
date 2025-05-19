export type ContainerTitleProps = {
	children: string;
};

export default function ContainerTitle({ children }: ContainerTitleProps) {
	return (
		<span className="font-semibold text-gray-950 text-sm">{children}</span>
	);
}
