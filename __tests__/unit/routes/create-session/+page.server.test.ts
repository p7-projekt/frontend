import { describe, it, expect, vi } from 'vitest';
import { load, actions } from '$src/routes/create-session/+page.server';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { getExerciseIds, getProgrammingLanguages } from '$src/routes/create-session/create_session';
import { redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	fail: vi.fn((status, body) => ({ status, body }))
}));

vi.mock('$lib/fetchRequests', () => ({
	fetchExerciseData: vi.fn(),
	fetchCreateSession: vi.fn(),
	fetchCreateClassroomSession: vi.fn()
}));

vi.mock('$lib/requestHandler', () => ({
	handleAuthenticatedRequest: vi.fn()
}));

vi.mock('$src/routes/create-session/create_session', () => ({
	getExerciseIds: vi.fn(),
	getProgrammingLanguages: vi.fn()
}));

describe('Page Server Load function', () => {
	const mockDepends = vi.fn();

	it('returns null when no tokens are available', async () => {
		const mockCookies = {
			get: vi.fn(() => null),
			set: vi.fn(),
			delete: vi.fn()
		};

		const result = await load({ cookies: mockCookies, depends: mockDepends });
		expect(result).toEqual({
			instructor_exercises: null,
			programming_languages: null,
			classroom_id: null,
			session: null
		});
	});

	it('fetches instructor exercises successfully', async () => {
		// Arrange
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		const mockInstructorExercises = [
			{ id: 1, name: 'Exercise 1' },
			{ id: 2, name: 'Exercise 2' }
		];
		const mockProgrammingLanguages = [
			{ languageId: 1, language: 'haskell' },
			{ languageId: 2, name: 'python' }
		];

		handleAuthenticatedRequest.mockResolvedValueOnce({
			ok: true,
			json: async () => mockInstructorExercises
		});

		handleAuthenticatedRequest.mockResolvedValueOnce({
			ok: true,
			json: async () => mockProgrammingLanguages
		});

		const mockDepends = vi.fn();

		// Mock the `url` object with `searchParams`
		const mockUrl = new URL('http://localhost/?classroom=123');

		// Act
		const result = await load({
			cookies: mockCookies,
			depends: mockDepends,
			url: mockUrl
		});

		// Assert
		expect(result).toEqual({
			instructor_exercises: mockInstructorExercises,
			programming_languages: mockProgrammingLanguages,
			classroom_id: '123'
		});
	});
});

describe('Page Server Action oneOffSession', () => {
	it('fails if session title is missing', async () => {
		const formData = new FormData();
		formData.set('session-description', 'Test description');
		formData.set('selected-expiration', '2');
		formData.set('selected-language', '["JavaScript"]');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = {
			formData: async () => formData
		};

		const result = await actions.oneOffSession({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'string',
					message: 'Expected string, received null',
					path: ['title'],
					received: 'null'
				}),
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'array',
					message: 'Required',
					path: ['exerciseIds'],
					received: 'undefined'
				}),
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'array',
					message: 'Required',
					path: ['languageIds'],
					received: 'undefined'
				})
			])
		);
		expect(result.body.session_description).toBe('Test description');
	});

	it('fails if expiration time is missing', async () => {
		const formData = new FormData();
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('selected-language', '["JavaScript"]');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = {
			formData: async () => formData
		};

		const result = await actions.oneOffSession({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'number',
					message: 'Expected number, received nan',
					path: ['expiresInHours'],
					received: 'nan'
				}),
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'array',
					message: 'Required',
					path: ['exerciseIds'],
					received: 'undefined'
				}),
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'array',
					message: 'Required',
					path: ['languageIds'],
					received: 'undefined'
				})
			])
		);
		expect(result.body.session_description).toBe('Test description');
	});

	it('fails if programming language is missing', async () => {
		const formData = new FormData();
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('selected-expiration', '2');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = {
			formData: async () => formData
		};

		const result = await actions.oneOffSession({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'array',
					message: 'Required',
					path: ['languageIds'],
					received: 'undefined'
				})
			])
		);
		expect(result.body.session_description).toBe('Test description');
	});

	it('redirects on successful session creation', async () => {
		const formData = new FormData();
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('added-exercise-list', '1,2');
		formData.set('selected-expiration', '2');
		formData.set('selected-language', '["1"]');

		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		// Mock the exercise IDs conversion and authenticated request
		getExerciseIds.mockReturnValue([1, 2]);
		getProgrammingLanguages.mockReturnValue([1]);
		handleAuthenticatedRequest.mockResolvedValueOnce({ ok: true });

		const request = { formData: async () => formData };

		await expect(actions.oneOffSession({ request, cookies: mockCookies })).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');

		expect(handleAuthenticatedRequest).toHaveBeenCalledWith(
			expect.any(Function), // We expect a function to be passed
			'valid_token',
			'refresh_token',
			mockCookies
		);
	});
});

describe('Page Server Action - classroomSession', () => {
	it('fails if exercises are missing', async () => {
		const formData = new FormData();
		formData.set('classroom-id', '123');
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('selected-language', '["1"]');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = {
			formData: async () => formData
		};

		// Mock data explicitly for this test
		getExerciseIds.mockReturnValue([]); // No exercises selected
		getProgrammingLanguages.mockReturnValue([1]); // Valid programming language

		// Perform the action
		const result = await actions.classroomSession({ request, cookies: mockCookies });

		// Validate the result
		expect(result.status).toBe(400);
		expect(result.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'too_small',
					message: 'You must select at least one exercise!',
					path: ['exerciseIds']
				})
			])
		);
	});

	it('fails if validation fails', async () => {
		const formData = new FormData();
		formData.set('classroom-id', '123');
		formData.set('session-title', ''); // Empty title
		formData.set('session-description', 'Test description');
		formData.set('added-exercise-list', '1,2');
		formData.set('selected-language', '["1"]');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = {
			formData: async () => formData
		};

		const result = await actions.classroomSession({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'too_small',
					exact: false,
					inclusive: true,
					message: 'The title must consist of at least one character',
					minimum: 1,
					path: ['title'],
					type: 'string'
				})
			])
		);
		expect(result.body.session_description).toBe('Test description');
	});

	it('redirects on successful classroom session creation', async () => {
		const formData = new FormData();
		formData.set('classroom-id', '123');
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('added-exercise-list', '1,2');
		formData.set('selected-language', '["1"]');

		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		// Mock the exercise IDs conversion and authenticated request
		getExerciseIds.mockReturnValue([1, 2]);
		getProgrammingLanguages.mockReturnValue([1]);
		handleAuthenticatedRequest.mockResolvedValueOnce({ ok: true });

		const request = { formData: async () => formData };

		await expect(actions.classroomSession({ request, cookies: mockCookies })).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/classroom/123');

		expect(handleAuthenticatedRequest).toHaveBeenCalledWith(
			expect.any(Function), // We expect a function to be passed
			'valid_token',
			'refresh_token',
			mockCookies
		);
	});

	it('handles unsuccessful API response', async () => {
		const formData = new FormData();
		formData.set('classroom-id', '123');
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('added-exercise-list', '1,2');
		formData.set('selected-language', '["1"]');

		const mockCookies = {
			get: vi.fn((name) => {
				if (name === 'access_token') return 'valid_token';
				if (name === 'refresh_token') return 'refresh_token';
				return null;
			}),
			set: vi.fn(),
			delete: vi.fn()
		};

		// Mock the exercise IDs conversion and authenticated request
		getExerciseIds.mockReturnValue([1, 2]);
		getProgrammingLanguages.mockReturnValue([1]);
		handleAuthenticatedRequest.mockResolvedValueOnce({ ok: false }); // Simulate a failed API call

		const request = { formData: async () => formData };

		const result = await actions.classroomSession({ request, cookies: mockCookies });

		expect(result).toBeUndefined(); // No redirect or errors
		expect(redirect).not.toHaveBeenCalled();
		expect(handleAuthenticatedRequest).toHaveBeenCalledWith(
			expect.any(Function), // We expect a function to be passed
			'valid_token',
			'refresh_token',
			mockCookies
		);
	});
});
