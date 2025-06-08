import CloudLogoBlack from '~/assets/images/cloud-black.webp';
import CloudLogo from '~/assets/images/cloud.webp';

export type LogoProps = {
	isBlack?: boolean;
};

export default function Logo({ isBlack }: Readonly<LogoProps>) {
	const logo = isBlack ? CloudLogoBlack : CloudLogo;

	return (
		<img
			src={logo}
			alt="서비스 로고"
			className="aspect-square h-full w-12 object-cover object-center"
		/>
	);
}
