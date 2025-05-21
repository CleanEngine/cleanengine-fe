import * as cookie from 'cookie';
import { type LoaderFunctionArgs, redirect } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
	const rawCookie = request.headers.get('Cookie');
	const cookies = cookie.parse(rawCookie || '');
	const isAccessTokenExists = !!cookies.access_token;

	if (!isAccessTokenExists) {
		return redirect('/trade/BTC/login');
	}

	return redirect('/trade');

	// 이전로직:
	// try {
	// 	await api.checkToken();
	// } catch (error) {
	// 	return redirect('/trade/login');
	// }
	// return redirect('/trade');
}

export default function CallbackRoutes() {
	return null;
}
