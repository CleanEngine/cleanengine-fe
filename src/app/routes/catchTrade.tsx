import { Outlet, redirect } from 'react-router';

export async function loader() {
	return redirect('/trade/BTC');
}

export default function CatchTradeRouteComponent() {
	return <Outlet />;
}
