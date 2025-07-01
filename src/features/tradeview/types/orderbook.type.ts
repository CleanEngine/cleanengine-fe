export type OrderBookChartData = {
	name: string;
	price: number;
	size: number;
};

export type OrderBookUnitRaw = {
	price: unknown;
	size: unknown;
};

export type OrderBookData = {
	ticker: string;
	buyOrderBookChartData: OrderBookChartData[];
	sellOrderBookChartData: OrderBookChartData[];
};

export type RawOrderBookData = {
	ticker: string;
	buyOrderBookUnits: OrderBookUnitRaw[];
	sellOrderBookUnits: OrderBookUnitRaw[];
};
