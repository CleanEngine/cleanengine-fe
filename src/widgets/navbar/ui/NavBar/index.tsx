import { Link, type LinkProps, NavLink, useSubmit } from 'react-router';
import type { CoinTicker } from '~/entities/coin';
import Button from '~/shared/ui/Button';
import LogoWithTitle, {
	type LogoWithTitleProps,
} from '~/shared/ui/LogoWithTitle';

export type NavBarProps = {
	to: LinkProps['to'];
	isLoggedIn?: boolean;
	ticker?: CoinTicker;
} & LogoWithTitleProps;

export default function NavBar({
	to,
	serviceName,
	isBlack,
	isLoggedIn,
	ticker,
}: NavBarProps) {
	const submit = useSubmit();

	const handleLogout = () => {
		submit(null, { action: `/trade/${ticker}`, method: 'post' });
	};

	const LoginButton = () => (
		<NavLink to={`/trade/${ticker}/login`}>
			<Button>로그인</Button>
		</NavLink>
	);

	const LogoutButton = () => <Button onClick={handleLogout}>로그아웃</Button>;

	return (
		<>
			<nav className="fixed flex h-[60px] w-full items-center justify-between px-4">
				<Link to={to}>
					<LogoWithTitle serviceName={serviceName} isBlack={isBlack} />
				</Link>
				{isLoggedIn ? <LogoutButton /> : <LoginButton />}
			</nav>
			<div className="h-[60px]" />
		</>
	);
}
