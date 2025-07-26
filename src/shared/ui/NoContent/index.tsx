import Lottie from 'lottie-react';

import NoContentAnimation from '~/assets/lotties/no-content.json';
import ClientOnly from '../ClientOnly';

export type NoContentProps = {
	title: string;
	description?: string;
};

export default function NoContent({ title, description }: NoContentProps) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<ClientOnly>
				<Lottie
					animationData={NoContentAnimation}
					className="w-40"
					loop
					autoplay
				/>
			</ClientOnly>
			<p className="font-semibold text-2xl text-gray-700">{title}</p>
			{description && <p className="pt-1 text-gray-500">{description}</p>}
		</div>
	);
}
