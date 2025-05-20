export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

export function isNegative(value: number): boolean {
	return value < 0;
}

export function formatCurrencyKR(value: number): string {
	return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

export function filterNumber(value: string): boolean {
	return /^[0-9]*(\.[0-9]*)?$/.test(value);
}

export function preventNonNumericInput(event: React.KeyboardEvent): void {
	if (
		!/^\d$/.test(event.key) &&
		![
			'Backspace',
			'Tab',
			'Enter',
			'ArrowLeft',
			'ArrowRight',
			'Delete',
			'Home',
			'End',
		].includes(event.key) &&
		event.key !== '.'
	) {
		event.preventDefault();
	}
}
