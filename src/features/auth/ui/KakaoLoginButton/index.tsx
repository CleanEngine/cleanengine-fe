import { IconKakao } from '~/assets/svgs';

export default function KakaoLoginButton() {
	return (
		<a
			href={import.meta.env.VITE_OAUTH_URL}
			className="relative flex h-8 w-max items-center justify-center rounded-md bg-kakao px-10 hover:bg-kakao/80 active:bg-kakao/90"
		>
			<IconKakao className="absolute left-0.5 aspect-square h-max w-8 fill-black px-2 text-black" />
			<span className="text-xs">카카오로 로그인</span>
		</a>
	);
}
