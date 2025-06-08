import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ExecutionItem from '.';

const props = {
	price: 1000,
	size: 1,
	timestamp: new Date().toISOString(),
	isGray: false,
	changeRate: 3,
	transactionId: '1',
	ticker: 'BTC',
};

describe('ExecutionItem 컴포넌트 테스트', () => {
	it('ExecutionItem이 화면에 렌더링된다.', async () => {
		render(<ExecutionItem {...props} />);

		const price = screen.getByText('1,000원');
		const size = screen.getByText(String(props.size.toFixed(6)));
		const timestamp = screen.getByText(
			Intl.DateTimeFormat('ko-KR', {
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
			}).format(new Date(props.timestamp)),
		);
		const changeRate = screen.getByText('3.00%');

		expect(price).toBeInTheDocument();
		expect(size).toBeInTheDocument();
		expect(timestamp).toBeInTheDocument();
		expect(changeRate).toBeInTheDocument();
	});

	it('변동률이 0이면 text-gray-400이 적용된다.', async () => {
		render(<ExecutionItem {...props} changeRate={0} />);

		const changeRate = screen.getByText('0.00%');

		expect(changeRate.parentElement).toHaveClass('text-gray-400');
	});

	it('변동률이 0보다 크면 text-red-600이 적용된다.', async () => {
		render(<ExecutionItem {...props} changeRate={1} />);

		const changeRate = screen.getByText('1.00%');

		expect(changeRate.parentElement).toHaveClass('text-red-600');
	});

	it('변동률이 0보다 작으면 text-blue-700이 적용된다.', async () => {
		render(<ExecutionItem {...props} changeRate={-1} />);

		const changeRate = screen.getByText('-1.00%');

		expect(changeRate.parentElement).toHaveClass('text-blue-700');
	});

	it('isGray가 true이면 bg-gray-100이 적용된다.', async () => {
		render(<ExecutionItem {...props} isGray />);

		const executionItem = screen.getByTestId('execution-item');

		expect(executionItem).toHaveClass('bg-gray-100');
	});
});
