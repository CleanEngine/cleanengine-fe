import type { CandlestickData } from 'lightweight-charts';
import { useLayoutEffect, useRef } from 'react';
import { formatCurrencyKR } from '~/shared/utils';
import { useChartContainer } from './ChartContainer';
import { useChartRoot } from './ChartRoot';
import { useSeries } from './Series';

const TOOLTIP_WIDTH = 80;
const TOOLTIP_HEIGHT = 80;
const TOOLTIP_MARGIN = 15;

export default function ToolTip() {
	const { root: chartRoot } = useChartRoot();
	const chartContainer = useChartContainer();
	const series = useSeries();
	const toolTipElementRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const chart = chartContainer.getInstance();
		const chartSeries = series.getInstance();

		chart.subscribeCrosshairMove((param) => {
			if (!chartRoot || !toolTipElementRef.current) return;

			if (
				param.point === undefined ||
				!param.time ||
				param.point.x < 0 ||
				param.point.y < 0 ||
				!chartSeries
			) {
				toolTipElementRef.current.style.display = 'none';
			} else {
				const x = param.point.x;
				const y = param.point.y;
				const { close, high, low, open, time } = param.seriesData.get(
					chartSeries,
				) as CandlestickData;

				toolTipElementRef.current.style.display = 'block';
				toolTipElementRef.current.innerHTML = `<div style="border: 1px solid #d1d5db; background-color: white; padding: 0.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); color: #1f2937; z-index: 40;">
			<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 0.5rem; row-gap: 0.25rem; font-size: 0.75rem; line-height: 1rem;">
				<div style="color: #4b5563;">Open:</div>
				<div style="font-weight: 500;">${formatCurrencyKR(open)}원</div>
				<div style="color: #4b5563;">High:</div>
				<div style="font-weight: 500; color: #059669;">${formatCurrencyKR(high)}원</div>
				<div style="color: #4b5563;">Low:</div>
				<div style="font-weight: 500; color: #dc2626;">${formatCurrencyKR(low)}원</div>
				<div style="color: #4b5563;">Close:</div>
				<div style="font-weight: 500;">${formatCurrencyKR(close)}원</div>
			</div>
			<div style="border-top: 1px solid #e5e7eb; padding-top: 0.25rem; margin-top: 0.25rem;">
				<div style="color: #6b7280; font-size: 0.75rem; line-height: 1rem;">${new Date((time as number) * 1000).toLocaleString()}</div>
			</div>
		</div>`;

				let left = x + TOOLTIP_MARGIN;
				if (left > chartRoot.clientWidth - TOOLTIP_WIDTH) {
					left = x - TOOLTIP_MARGIN - TOOLTIP_WIDTH;
				}

				let top = y + TOOLTIP_MARGIN;
				if (top > chartRoot.clientHeight - TOOLTIP_HEIGHT) {
					top = y - TOOLTIP_MARGIN - TOOLTIP_HEIGHT;
				}

				toolTipElementRef.current.style.left = `${left}px`;
				toolTipElementRef.current.style.top = `${top}px`;
			}
		});
	}, [chartContainer, series, chartRoot]);

	return (
		<div
			id="tooltip"
			ref={toolTipElementRef}
			className="absolute z-40 hidden h-auto w-aut bg-white text-left text-gray-800 text-xs"
		/>
	);
}
