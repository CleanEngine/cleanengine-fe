declare module '*.svg' {
	import type { SVGProps } from 'react';
	export const ReactComponent: React.FC<SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}
