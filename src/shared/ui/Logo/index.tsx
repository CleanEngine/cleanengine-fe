import CloudLogoBlack from '~/assets/images/cloud-black.png';
import CloudLogo from '~/assets/images/cloud.png';

export type LogoProps = {
	isBlack?: boolean;
};

export default function Logo({ isBlack }: LogoProps) {
	const logo = isBlack ? CloudLogoBlack : CloudLogo;

	return (
		<img
			src={logo}
			alt="서비스 로고"
			className="aspect-square h-full object-cover object-center"
		/>
	);
}
