import { vi, describe, test, expect } from 'vitest';
import { _deleteExercise } from '../../../src/routes/+page';

// Mock fetch globally for all tests
global.fetch = vi.fn();

describe('_deleteExercise', () => {
	test('should delete an exercise and return the updated state when fetch is successful', async () => {
		// Arrange
		const selectedExerciseId = 1;
		const instructorExercises = [
			{ id: 1, content: 'Exercise 1' },
			{ id: 2, content: 'Exercise 2' }
		];

		// Mock the fetch response to simulate a successful delete
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true, // This simulates a 200 OK response
				json: () => Promise.resolve({ message: 'Exercise deleted' })
			})
		);

		// Act
		const result = await _deleteExercise(selectedExerciseId, instructorExercises);

		// Assert
		expect(fetch).toHaveBeenCalledWith('/api/delete-exercise', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ exercise_id: selectedExerciseId })
		});
		expect(result).toEqual({
			instructor_exercises: [{ id: 2, content: 'Exercise 2' }],
			isDialogOpen: false,
			selected_exercise_id: null,
			selected_exercise_title: null
		});
	});

	test('should not update instructor_exercises if fetch fails', async () => {
		// Arrange
		const selectedExerciseId = 1;
		const instructorExercises = [
			{ id: 1, content: 'Exercise 1' },
			{ id: 2, content: 'Exercise 2' }
		];

		// Mock the fetch response to simulate a failed delete request
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false, // Simulate a failed response
				json: () => Promise.resolve({ error: 'Failed to delete exercise' })
			})
		);

		// Act
		const result = await _deleteExercise(selectedExerciseId, instructorExercises);

		// Assert
		expect(fetch).toHaveBeenCalled();
		expect(result).toBeUndefined();
	});
});
