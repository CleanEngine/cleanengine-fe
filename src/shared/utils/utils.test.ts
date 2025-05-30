import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
	filterNumber,
	formatCurrencyKR,
	isNegative,
	isUndefined,
	preventNonNumericInput,
} from '.';

describe('util 함수 테스트', () => {
	describe('isUndefined 테스트', () => {
		it('undefined가 전달되면 true를 반환한다.', () => {
			const result = isUndefined(undefined);

			expect(result).toBe(true);
		});

		it('undefined를 제외한 값이 전달되면 false를 반환한다.', () => {
			const result = isUndefined(123);

			expect(result).toBe(false);
		});
	});

	describe('isNegative 테스트', () => {
		it('음수를 전달하면 true를 반환한다.', () => {
			const result = isNegative(-1);

			expect(result).toBe(true);
		});

		it('양수를 전달하면 false를 반환한다.', () => {
			const result = isNegative(1);

			expect(result).toBe(false);
		});
	});

	describe('formatCurrencyKR 테스트', () => {
		it('123을 전달하면 문자열 123을 반환한다.', () => {
			const result = formatCurrencyKR(123);

			expect(result).toBe('123');
		});

		it('1234을 전달하면 문자열 1,234을 반환한다.', () => {
			const result = formatCurrencyKR(1234);

			expect(result).toBe('1,234');
		});

		it('1234.567을 전달하면 문자열 1,234.57을 반환한다.', () => {
			const result = formatCurrencyKR(1234.567);

			expect(result).toBe('1,234.57');
		});

		it('10000000을 전달하면 문자열 10,000,000을 반환한다.', () => {
			const result = formatCurrencyKR(10000000);

			expect(result).toBe('10,000,000');
		});
	});

	describe('filterNumber 테스트', () => {
		it('숫자를 전달하면 true를 반환한다.', () => {
			const result = filterNumber('123');

			expect(result).toBe(true);
		});

		it('문자를 전달하면 false를 반환한다.', () => {
			const result = filterNumber('qwer');

			expect(result).toBe(false);
		});
	});

	describe('preventNonNumericInput 테스트', () => {
		it('숫자 key가 아닌 key가 전달되면 preventDefault가 호출된다.', () => {
			const event = {
				key: 'a',
				preventDefault: vi.fn(),
			} as unknown as KeyboardEvent;

			preventNonNumericInput(event);

			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('숫자 key가 전달되면 preventDefault가 호출되지 않는다.', () => {
			const event = {
				key: '1',
				preventDefault: vi.fn(),
			} as unknown as KeyboardEvent;

			preventNonNumericInput(event);

			expect(event.preventDefault).not.toHaveBeenCalled();
		});
	});
});
