type ClientOnlyProps = {
	children: React.ReactNode;
	fallback?: React.ReactNode;
};

export default function ClientOnly({
	children,
	fallback = null,
}: ClientOnlyProps) {
	return typeof window !== 'undefined' ? <>{children}</> : fallback;
}
