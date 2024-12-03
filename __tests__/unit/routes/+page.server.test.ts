import { describe, it, expect, vi } from 'vitest';
import { load } from '$src/routes/+page.server';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

vi.mock('$lib/requestHandler', () => ({
	handleAuthenticatedRequest: vi.fn()
}));

vi.mock('$lib/fetchRequests', () => ({
	fetchExerciseData: vi.fn(),
	fetchSessionsData: vi.fn()
}));

const mockDepends = vi.fn();

const mockParent = vi.fn(() => ({ name: 'Esben', role: 'Frontend Techlead' }));

describe('Page Server Load function', () => {
	it('returns null when no tokens are available', async () => {
		// Arrange
		const mockCookies = {
			get: vi.fn(() => null),
			set: vi.fn(),
			delete: vi.fn()
		};

		const result = await load({ cookies: mockCookies, depends: mockDepends, parent: mockParent });
		expect(result).toEqual({ classrooms: null, instructor_exercises: null, sessions: null });
	});

	it('successfully fetches session and classroom but not instructor exercise data', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		const mockClassroomData = [
			{
				id: 1,
				title: 'My first classroom',
				description: 'This is a description',
				roomcode: '8927DB',
				isOpen: false,
				sessions: [{ id: 7, title: 'My first classroom session', active: false }]
			},
			{
				id: 2,
				title: 'My second classroom',
				description: 'This is a description',
				roomcode: 'lol123',
				isOpen: true,
				sessions: [{ id: 7, title: 'My first classroom session', active: false }]
			}
		];

		const mockSessionData = [
			{
				id: 16,
				title: 'hej',
				expiresInSeconds: '3552',
				sessionCode: 'AA6001'
			}
		];

		handleAuthenticatedRequest
			.mockResolvedValueOnce({ ok: false })
			.mockResolvedValueOnce({ ok: true, json: async () => mockSessionData })
			.mockResolvedValueOnce({ ok: true, json: async () => mockClassroomData });

		const result = await load({ cookies: mockCookies, depends: mockDepends, parent: mockParent });

		expect(result).toEqual({
			classrooms: mockClassroomData,
			instructor_exercises: null,
			sessions: mockSessionData
		});
	});

	it('successfully fetches instructor exercise data but not session and classroom data', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		const mockInstructorExerciseData = [
			{
				id: 3,
				name: 'Haskell fun'
			},
			{
				id: 4,
				name: 'Haskell LOL'
			}
		];

		// Mock the responses for exercise and session data
		handleAuthenticatedRequest
			.mockResolvedValueOnce({
				ok: true,
				json: async () => mockInstructorExerciseData
			})
			.mockResolvedValueOnce({ ok: false })
			.mockResolvedValueOnce({ ok: false });

		// Call the load function with mock cookies and depends
		const result = await load({ cookies: mockCookies, depends: mockDepends, parent: mockParent });

		// Verify that the instructor exercises are returned and sessions are null
		expect(result).toEqual({
			classrooms: null,
			instructor_exercises: mockInstructorExerciseData,
			sessions: null
		});
	});
});
