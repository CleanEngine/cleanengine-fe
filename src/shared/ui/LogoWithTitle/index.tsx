import Logo, { type LogoProps } from '../Logo';

export type LogoWithTitleProps = {
	serviceName: string;
} & LogoProps;

export default function LogoWithTitle({
	serviceName,
	isBlack,
}: LogoWithTitleProps) {
	return (
		<div className="flex items-center gap-1">
			<Logo isBlack={isBlack} />
			<h1 className="text-xl font-medium text-gray-900">{serviceName}</h1>
		</div>
	);
}
