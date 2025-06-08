import { Link, type LinkProps, NavLink, useSubmit } from 'react-router';
import { useUserId } from '~/app/provider/UserInfoProvider';

import type { CoinTicker } from '~/entities/coin';
import Button from '~/shared/ui/Button';
import LogoWithTitle, {
	type LogoWithTitleProps,
} from '~/shared/ui/LogoWithTitle';
import MenuButton from '~/shared/ui/MenuButton';

export type NavBarProps = {
	to: LinkProps['to'];
	isLoggedIn?: boolean;
	ticker?: CoinTicker;
	onClickMenuButton: () => void;
} & LogoWithTitleProps;

export default function NavBar({
	to,
	serviceName,
	isBlack,
	isLoggedIn,
	ticker,
	onClickMenuButton,
}: NavBarProps) {
	const submit = useSubmit();
	const { setUserId } = useUserId();

	const handleLogout = () => {
		setUserId(null);
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
			<nav className="fixed z-30 flex h-[60px] w-full items-center justify-between px-4 backdrop-blur-md">
				<div className="2xl:hidden">
					<MenuButton onClick={onClickMenuButton} />
				</div>
				<Link to={to}>
					<LogoWithTitle serviceName={serviceName} isBlack={isBlack} />
				</Link>
				{isLoggedIn ? <LogoutButton /> : <LoginButton />}
			</nav>
			<div className="h-[60px]" />
		</>
	);
}
