import { IconKakao } from '~/assets/svgs';

export default function KakaoLoginButton() {
	//TODO: 카카오 로그인 URL 교체할 것
	return (
		<a
			href="https://naver.com"
			className="relative flex h-8 w-max items-center justify-center rounded-md bg-kakao px-10"
		>
			<IconKakao className="absolute left-0.5 aspect-square h-max w-8 fill-black px-2 text-black" />
			<span className="text-xs">카카오로 로그인</span>
		</a>
	);
}
