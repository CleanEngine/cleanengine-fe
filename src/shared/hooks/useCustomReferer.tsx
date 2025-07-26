import { useSearchParams } from 'react-router';

export default function useCustomReferer() {
	const [searchParams] = useSearchParams();

	return searchParams.get('referer');
}
