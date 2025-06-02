import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import ExecutionList from '.';
import useExecutionListData from '../../hooks/useExecutionListData';
import type { Execution } from '../../types/execution.type';

const executionListItems: Execution[] = [
	{
		price: 1000,
		size: 1,
		timestamp: new Date().toISOString(),
		changeRate: 3,
		transactionId: '1',
		ticker: 'BTC',
	},
	{
		price: 1000,
		size: 1,
		timestamp: new Date().toISOString(),
		changeRate: 3,
		transactionId: '2',
		ticker: 'BTC',
	},
	{
		price: 1000,
		size: 1,
		timestamp: new Date().toISOString(),
		changeRate: 3,
		transactionId: '3',
		ticker: 'BTC',
	},
	{
		price: 1000,
		size: 1,
		timestamp: new Date().toISOString(),
		changeRate: 3,
		transactionId: '4',
		ticker: 'BTC',
	},
	{
		price: 1000,
		size: 1,
		timestamp: new Date().toISOString(),
		changeRate: 3,
		transactionId: '5',
		ticker: 'BTC',
	},
];

vi.mock('../../hooks/useExecutionListData', () => {
	return {
		default: vi.fn(),
	};
});

describe('ExecutionList 컴포넌트 테스트', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('ExecutionList가 화면에 렌더링된다.', () => {
		(useExecutionListData as Mock).mockReturnValue(executionListItems);
		render(<ExecutionList ticker="BTC" />);

		const executionList = screen.getByTestId('execution-list');

		expect(executionList).toBeInTheDocument();

		const executionItem = screen.getAllByTestId('execution-item');

		expect(executionItem).toHaveLength(executionListItems.length);
	});

	it('데이터가 없을때는 "데이터가 없습니다"를 렌더링한다.', () => {
		(useExecutionListData as Mock).mockReturnValue([]);

		render(<ExecutionList ticker="BTC" />);

		const executionList = screen.getByTestId('execution-list');

		expect(executionList).toBeInTheDocument();

		expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
	});
});
