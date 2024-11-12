import { describe, it, expect, vi } from 'vitest';
import { load, actions } from '$src/routes/create-session/+page.server';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { getExerciseIds } from '$src/routes/create-session/create_session';
import { redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	fail: vi.fn((status, body) => ({ status, body }))
}));

vi.mock('$lib/fetchRequests', () => ({
	fetchExerciseData: vi.fn(),
	fetchCreateSession: vi.fn()
}));

vi.mock('$lib/requestHandler', () => ({
	handleAuthenticatedRequest: vi.fn()
}));

vi.mock('$src/routes/create-session/create_session', () => ({
	getExerciseIds: vi.fn()
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
		expect(result).toEqual({ instructor_exercises: null });
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

		handleAuthenticatedRequest.mockResolvedValueOnce({
			ok: true,
			json: async () => mockInstructorExercises
		});

		// Act
		const result = await load({ cookies: mockCookies, depends: mockDepends });

		// Assert
		expect(result).toEqual({ instructor_exercises: mockInstructorExercises });
	});
});

describe('Page Server Actions function', () => {
	it('fails if session title is missing', async () => {
		const formData = new FormData();
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

		const result = await actions.default({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body).toEqual({
			sessionTitleMissing: true,
			session_description: 'Test description',
			expirationMissing: false
		});
	});

	it('fails if expiration time is missing', async () => {
		const formData = new FormData();
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = {
			formData: async () => formData
		};

		const result = await actions.default({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body).toEqual({
			sessionTitleMissing: false,
			session_description: 'Test description',
			expirationMissing: true
		});
	});

	it('redirects on successful session creation', async () => {
		// Arrange
		const formData = new FormData();
		formData.set('session-title', 'Test Session');
		formData.set('session-description', 'Test description');
		formData.set('added-exercise-list', '1,2');
		formData.set('selected-expiration', '2');

		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		// Mock the exercise IDs conversion and authenticated request
		getExerciseIds.mockReturnValue([1, 2]);
		handleAuthenticatedRequest.mockResolvedValueOnce({ ok: true });

		const request = { formData: async () => formData };
		const expectedSessionData = {
			title: 'Test Session',
			description: 'Test description',
			expiresInHours: 2,
			exerciseIds: [1, 2]
		};

		// Act and Assert
		// Expect the action to throw a redirect and capture it
		await expect(actions.default({ request, cookies: mockCookies })).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');

		// Verify the body passed to handleAuthenticatedRequest
		expect(handleAuthenticatedRequest).toHaveBeenCalledWith(
			expect.any(Function), // We expect a function to be passed
			'valid_token',
			'refresh_token',
			mockCookies
		);
	});
});
