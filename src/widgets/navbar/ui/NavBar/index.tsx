import {
	Link,
	type LinkProps,
	NavLink,
	useLocation,
	useSubmit,
} from 'react-router';
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
	const location = useLocation();
	const submit = useSubmit();
	const { setUserId } = useUserId();

	const handleLogout = () => {
		setUserId(null);
		submit(null, { action: `/trade/${ticker}`, method: 'post' });
	};

	const LoginButton = () => (
		<NavLink to={`/trade/${ticker}/login?referer=${location.pathname}`}>
			<Button>로그인</Button>
		</NavLink>
	);

	const LogoutButton = () => (
		<Button buttonStyle="secondary" onClick={handleLogout}>
			로그아웃
		</Button>
	);

	const ProfileButton = () => (
		<NavLink
			to={`/trade/${ticker}/profile/history?referer=${location.pathname}`}
		>
			<Button>프로필</Button>
		</NavLink>
	);

	return (
		<>
			<nav className="fixed z-30 flex h-[60px] w-full items-center justify-between px-4 backdrop-blur-md">
				<div className="2xl:hidden">
					<MenuButton onClick={onClickMenuButton} />
				</div>
				<Link to={to}>
					<LogoWithTitle serviceName={serviceName} isBlack={isBlack} />
				</Link>
				<div className="flex items-center gap-1">
					{isLoggedIn ? <ProfileButton /> : null}
					{isLoggedIn ? <LogoutButton /> : <LoginButton />}
				</div>
			</nav>
			<div className="h-[60px]" />
		</>
	);
}
