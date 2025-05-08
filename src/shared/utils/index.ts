export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

export function isNegative(value: number): boolean {
	return value < 0;
}
