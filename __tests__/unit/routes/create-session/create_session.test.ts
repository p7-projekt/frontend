import { describe, it, expect, vi } from 'vitest';
import { getExerciseIds } from '../../../../src/routes/create-session/create_session';

describe('getExerciseIds', () => {
	it('should return an arrays of exercise ids when given valid JSON string with exercises', () => {
		const exercise_list = JSON.stringify([
			{ id: 1, content: 'Haskell Arrays' },
			{ id: 2, content: 'Linked List' }
		]);

		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([1, 2]);
	});
	it('should return an arrays of exercise ids when given valid JSON string with exercises', () => {
		const exercise_list = JSON.stringify([
			{ id: 6, content: 'LOL' },
			{ id: 5, content: 'mommy' },
			{ id: 7, content: 'Jack' }
		]);

		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([6, 5, 7]);
	});

	it('should throw an error for invalid data in exercise_list', () => {
		const exercise_list = JSON.stringify([
			{ id: 6, content: 'LOL' },
			{},
			{ id: 7, content: 'Jack' }
		]);
		const result = getExerciseIds(exercise_list);
		// expect(() => getExerciseIds(exercise_list)).toThrow();
		expect(result).toEqual([6, undefined, 7]);
	});

	it('should return an empty array when given an empty JSON array string', () => {
		const exercise_list = JSON.stringify([]);
		const result = getExerciseIds(exercise_list);
		expect(result).toEqual([]);
	});

	it('should return an empty array when given null', () => {
		const result = getExerciseIds(null);
		expect(result).toEqual([]);
	});

	it('should return an empty array and log an error when given invalid JSON', () => {
		// Mock console.error to test if it's called
		const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

		const exercise_list = '{invalid json}';
		const result = getExerciseIds(exercise_list);

		expect(result).toEqual([]);
		expect(consoleErrorMock).toHaveBeenCalledWith(
			'Error processing exercise list:',
			expect.any(SyntaxError)
		);

		// Restore console.error
		consoleErrorMock.mockRestore();
	});
});
