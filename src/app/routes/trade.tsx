import { Outlet } from 'react-router';
import { NavBar } from '~/widgets/navbar';

export default function TradeRouteComponent() {
	return (
		<div>
			<NavBar to="/" serviceName="IF" isBlack />
			<Outlet />
		</div>
	);
}
