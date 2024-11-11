import { vi, describe, test, expect } from 'vitest';
import {
	fetchCreateSession,
	fetchSpecificSession,
	fetchExerciseData,
	get_userID,
	fetchUserData,
	fetchDeleteSession,
	fetchDeleteExercise,
	fetchSessionsData
} from '../../../src/lib/fetchRequests';

// Mock fetch globally for all tests
global.fetch = vi.fn();

describe('fetchCreateSession', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token = 'mocked_access_token';
	const new_session = {
		title: 'New Session',
		description: 'Session Description',
		expiresInHours: 2,
		exerciseIds: [1, 2, 3]
	};

	test('should send a POST request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true
			})
		);

		// Act
		const response = await fetchCreateSession(backendUrl, api_version, access_token, new_session);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/sessions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`
			},
			body: JSON.stringify(new_session)
		});
		expect(response.ok).toBe(true);
	});
});

describe('fetchSpecificSession', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token = 'mocked_access_token';
	const session_id = 123;

	test('should send a GET request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ id: session_id, title: 'Specific Session' })
			})
		);

		// Act
		const response = await fetchSpecificSession(backendUrl, api_version, access_token, session_id);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/sessions/${session_id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(true);
		const json = await response.json();
		expect(json).toEqual({ id: session_id, title: 'Specific Session' });
	});

	test('should return an error response when fetch fails', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false,
				status: 404,
				json: () => Promise.resolve({ error: 'Session not found' })
			})
		);

		// Act
		const response = await fetchSpecificSession(backendUrl, api_version, access_token, session_id);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/sessions/${session_id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(false);
		expect(response.status).toBe(404);
		const json = await response.json();
		expect(json).toEqual({ error: 'Session not found' });
	});
});

describe('fetchExerciseData', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token = 'mocked_access_token';

	test('should send a GET request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve([
						{ id: 1, name: 'Exercise 1' },
						{ id: 2, name: 'Exercise 2' }
					])
			})
		);

		// Act
		const response = await fetchExerciseData(backendUrl, api_version, access_token);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/exercises`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(true);
	});
});

describe('get_userID', () => {
	test('should return the user ID when a valid token is provided', () => {
		const expected_userID = '1';
		const access_token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikluc3RydWN0b3IiLCJleHAiOjE3MzExNzM4NDgsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.7v55gz2XsdR-MTPRPmBmN_1rl6x9Kl-G0VvdrFAsceM';

		// Call `get_anon_userID` with the mocked `cookies` object
		const result = get_userID(access_token);

		expect(result).toEqual(expected_userID);
	});
	test('should return null and log an error when an invalid token is provided', () => {
		// Arrange
		const expected_userID = null;
		const access_token = 'lol';

		// Mock console.error
		const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

		// Act
		const result = get_userID(access_token);

		// Assert
		expect(result).toEqual(expected_userID);
		expect(consoleErrorMock).toHaveBeenCalledWith('Invalid token:', expect.any(String));

		// Restore console.error after the test
		consoleErrorMock.mockRestore();
	});
});

// This is technically a integration test, consider moving it
describe('fetchUserData', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikluc3RydWN0b3IiLCJleHAiOjE3MzExNzM4NDgsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.7v55gz2XsdR-MTPRPmBmN_1rl6x9Kl-G0VvdrFAsceM';

	test('should send a GET request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ name: 'John Snow' })
			})
		);

		// Act
		const response = await fetchUserData(backendUrl, api_version, access_token);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/users/1`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(true);
	});
});

describe('fetchDeleteSession', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikluc3RydWN0b3IiLCJleHAiOjE3MzExNzM4NDgsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.7v55gz2XsdR-MTPRPmBmN_1rl6x9Kl-G0VvdrFAsceM';
	const session_id = 7;
	test('should send a DELETE request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true
			})
		);

		// Act
		const response = await fetchDeleteSession(backendUrl, api_version, access_token, session_id);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/sessions/7`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(true);
	});
});

describe('fetchDeleteExercise', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikluc3RydWN0b3IiLCJleHAiOjE3MzExNzM4NDgsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.7v55gz2XsdR-MTPRPmBmN_1rl6x9Kl-G0VvdrFAsceM';
	const exercise_id = 2;
	test('should send a DELETE request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true
			})
		);

		// Act
		const response = await fetchDeleteExercise(backendUrl, api_version, access_token, exercise_id);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/exercises/2`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(true);
	});
});

describe('fetchSessionsData', () => {
	const backendUrl = 'localhost:5015';
	const api_version = 'v1';
	const access_token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikluc3RydWN0b3IiLCJleHAiOjE3MzExNzM4NDgsImlzcyI6IkJhY2tlbmRlciIsImF1ZCI6IkZyb250ZW5kIn0.7v55gz2XsdR-MTPRPmBmN_1rl6x9Kl-G0VvdrFAsceM';

	test('should send a GET request with correct parameters and return a successful response', async () => {
		// Arrange
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true
			})
		);

		// Act
		const response = await fetchSessionsData(backendUrl, api_version, access_token);

		// Assert
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/${api_version}/sessions`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		expect(response.ok).toBe(true);
	});
});
