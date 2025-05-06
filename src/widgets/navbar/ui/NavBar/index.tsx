import { Link, type LinkProps, NavLink } from 'react-router';
import Button from '~/shared/ui/Button';
import LogoWithTitle, {
	type LogoWithTitleProps,
} from '~/shared/ui/LogoWithTitle';

export type NavBarProps = {
	to: LinkProps['to'];
	isLoggedIn?: boolean;
} & LogoWithTitleProps;

export default function NavBar({
	to,
	serviceName,
	isBlack,
	isLoggedIn,
}: NavBarProps) {
	const buttonLink = isLoggedIn ? '/profile' : '/login';
	const buttonText = isLoggedIn ? '프로필' : '로그인';

	return (
		<nav className="flex items-center justify-between h-[60px] px-4">
			<Link to={to}>
				<LogoWithTitle serviceName={serviceName} isBlack={isBlack} />
			</Link>
			<NavLink to={buttonLink}>
				<Button>{buttonText}</Button>
			</NavLink>
		</nav>
	);
}
