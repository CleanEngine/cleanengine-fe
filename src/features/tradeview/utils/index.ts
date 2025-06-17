import type { IDisposer } from '@amcharts/amcharts5';

export function isDisposed(...amchartElements: IDisposer[]) {
	return amchartElements.every((amchartElement) => amchartElement.isDisposed());
}
