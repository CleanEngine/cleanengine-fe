type Price = string;
type Size = number;

export type OrderBookUnit = {
	price: Price;
	size: Size;
};

export type OrderBookUnitRaw = {
	price: unknown;
	size: unknown;
};

export type OrderBookData = {
	ticker: string;
	buyOrderBookUnits: OrderBookUnit[];
	sellOrderBookUnits: OrderBookUnit[];
};

export type RawOrderBookData = {
	ticker: string;
	buyOrderBookUnits: OrderBookUnitRaw[];
	sellOrderBookUnits: OrderBookUnitRaw[];
};
