import { vi, describe, test, expect } from 'vitest';
import { _deleteExercise, _deleteSession } from '../../../src/routes/+page';

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

describe('_deleteSession', () => {
	test('should delete a session and return the updated state when fetch is successful', async () => {
		// Arrange
		const sessionId = 1;
		const sessions = [
			{ id: 1, title: 'Session 1', expiresInSeconds: 3600 },
			{ id: 2, title: 'Session 2', expiresInSeconds: 7200 }
		];

		// Mock the fetch response to simulate a successful delete
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true, // This simulates a 200 OK response
				json: () => Promise.resolve({ message: 'Session deleted' })
			})
		);

		// Act
		const result = await _deleteSession(sessionId, sessions);

		// Assert
		expect(fetch).toHaveBeenCalledWith('/api/delete-session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ session_id: sessionId })
		});
		expect(result).toEqual({
			sessions: [{ id: 2, title: 'Session 2', expiresInSeconds: 7200 }],
			isDialogOpen: false,
			selected_session_id: null,
			selected_session_title: null
		});
	});

	test('should not update sessions if fetch fails', async () => {
		// Arrange
		const sessionId = 1;
		const sessions = [
			{ id: 1, title: 'Session 1', expiresInSeconds: 3600 },
			{ id: 2, title: 'Session 2', expiresInSeconds: 7200 }
		];

		// Mock the fetch response to simulate a failed delete request
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false, // Simulate a failed response
				json: () => Promise.resolve({ error: 'Failed to delete session' })
			})
		);

		// Act
		const result = await _deleteSession(sessionId, sessions);

		// Assert
		expect(fetch).toHaveBeenCalled();
		expect(result).toBeUndefined();
	});
});
