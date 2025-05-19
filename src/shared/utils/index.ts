export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

export function isNegative(value: number): boolean {
	return value < 0;
}

export function formatCurrencyKR(value: number): string {
	return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}
