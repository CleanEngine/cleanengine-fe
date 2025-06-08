import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import type { UserInfoResponse } from '~/entities/user/types/user.type';

type UserInfoContextType = {
	userId: UserInfoResponse['data']['userId'] | null;
	setUserId: (userId: UserInfoResponse['data']['userId'] | null) => void;
};

type UserIdProviderProps = {
	children: ReactNode;
};

export const UserIdContext = createContext<UserInfoContextType | null>(null);

export default function UserIdProvider({
	children,
}: Readonly<UserIdProviderProps>) {
	const [userId, setUserId] = useState<UserInfoContextType['userId'] | null>(
		null,
	);

	useEffect(() => {
		const storedUserId = window.localStorage.getItem('userId');

		if (!storedUserId) return;

		setUserId(Number(storedUserId));
	}, []);

	useEffect(() => {
		if (!userId) {
			window.localStorage.removeItem('userId');
			return;
		}

		window.localStorage.setItem('userId', String(userId));
	}, [userId]);

	return (
		<UserIdContext.Provider value={{ userId, setUserId }}>
			{children}
		</UserIdContext.Provider>
	);
}

export function useUserId() {
	const context = useContext(UserIdContext);

	if (!context) {
		throw new Error(
			'useUserId hook은 UserIdProvider 내부에서 사용해야 합니다.',
		);
	}

	return context;
}
