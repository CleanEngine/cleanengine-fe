import Lottie from 'lottie-react';
import ErrorAnimation from '~/assets/lotties/error.json';
import ClientOnly from '../ClientOnly';

export type ErrorComponentProps = {
	title: string;
	description: string;
};

export default function ErrorComponent({
	title,
	description,
}: ErrorComponentProps) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<ClientOnly>
				<Lottie animationData={ErrorAnimation} className="w-40" loop autoplay />
			</ClientOnly>
			<p className="font-semibold text-2xl text-gray-700">{title}</p>
			<p className="pt-1 text-gray-500">{description}</p>
		</div>
	);
}
