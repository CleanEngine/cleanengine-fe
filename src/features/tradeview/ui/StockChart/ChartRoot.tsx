import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useState,
} from 'react';

type ChartRootProps = PropsWithChildren;

type RootContext = {
	root: HTMLDivElement | null;
};

const Context = createContext<RootContext | null>(null);

export default function ChartRoot({ children }: ChartRootProps) {
	const [root, setRoot] = useState<HTMLDivElement | null>(null);
	const handleRef = useCallback((ref: HTMLDivElement) => setRoot(ref), []);

	return (
		<Context.Provider value={{ root: root }}>
			<div className="h-full w-full" ref={handleRef}>
				{root && children}
			</div>
		</Context.Provider>
	);
}

export const useChartRoot = () => {
	const context = useContext(Context);
	if (!context) {
		throw new Error('useChartRoot must be used within a ChartRoot');
	}
	return context;
};
