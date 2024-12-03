import { describe, it, expect, vi } from 'vitest';
import { POST } from '$src/routes/api/update-session-status/+server';
import { fetchSpecificClassroomSession, fetchUpdateClassroomSession } from '$lib/fetchRequests';

// Mock `fetchSpecificClassroomSession` and `fetchUpdateClassroomSession`
vi.mock('$lib/fetchRequests', () => ({
	fetchSpecificClassroomSession: vi.fn(),
	fetchUpdateClassroomSession: vi.fn()
}));

global.fetch = vi.fn();

describe('POST /update-classroom-session', () => {
	const backendUrl = 'http://localhost:5015';
	const api_version_v2 = 'v2';

	it('returns 200 with success message when session is fetched and updated successfully', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/update-classroom-session', {
			method: 'POST',
			body: JSON.stringify({
				classroom_id: 'classroom123',
				session_id: 'session123',
				activation_status: true
			})
		});

		// Mock fetching the session successfully
		fetchSpecificClassroomSession.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				id: 'session123',
				title: 'Session Title',
				description: 'Session Description',
				exercises: [{ exerciseId: 'exercise1' }, { exerciseId: 'exercise2' }],
				languages: ['en', 'fr']
			})
		});

		// Mock updating the session successfully
		fetchUpdateClassroomSession.mockResolvedValueOnce({ ok: true });

		const response = await POST({ request, cookies: mockCookies });

		expect(response.status).toBe(200);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ message: 'Session updated' });
	});

	it('refreshes token and returns 200 with success message when access token is expired', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? null : 'old_refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/update-classroom-session', {
			method: 'POST',
			body: JSON.stringify({
				classroom_id: 'classroom123',
				session_id: 'session123',
				activation_status: true
			})
		});

		// Mock fetching the session fails initially, but succeeds after refresh
		fetchSpecificClassroomSession
			.mockResolvedValueOnce({ ok: false, status: 401 })
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: 'session123',
					title: 'Session Title',
					description: 'Session Description',
					exercises: [{ exerciseId: 'exercise1' }, { exerciseId: 'exercise2' }],
					languages: ['en', 'fr']
				})
			});

		// Mock updating the session successfully
		fetchUpdateClassroomSession.mockResolvedValueOnce({ ok: true });

		// Mock token refresh request
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				token: 'new_access_token',
				refreshToken: 'new_refresh_token',
				expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
			})
		});

		const response = await POST({ request, cookies: mockCookies });
		const jsonResponse = await response.json();

		expect(response.status).toBe(200);
		expect(jsonResponse).toEqual({ message: 'Session updated' });
		expect(fetchSpecificClassroomSession).toHaveBeenCalledTimes(2);
		expect(fetchUpdateClassroomSession).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(mockCookies.set).toHaveBeenCalledWith(
			'access_token',
			'new_access_token',
			expect.any(Object)
		);
		expect(mockCookies.set).toHaveBeenCalledWith(
			'refresh_token',
			'new_refresh_token',
			expect.any(Object)
		);
	});

	it('returns 500 with error message when fetching the session fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/update-classroom-session', {
			method: 'POST',
			body: JSON.stringify({
				classroom_id: 'classroom123',
				session_id: 'session123',
				activation_status: true
			})
		});

		// Mock fetching the session fails
		fetchSpecificClassroomSession.mockResolvedValueOnce({ ok: false });

		const response = await POST({ request, cookies: mockCookies });

		expect(response.status).toBe(500);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: 'Failed to update session' });
	});

	it('returns 500 with error message when updating the session fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/update-classroom-session', {
			method: 'POST',
			body: JSON.stringify({
				classroom_id: 'classroom123',
				session_id: 'session123',
				activation_status: true
			})
		});

		// Mock fetching the session successfully
		fetchSpecificClassroomSession.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				id: 'session123',
				title: 'Session Title',
				description: 'Session Description',
				exercises: [{ exerciseId: 'exercise1' }, { exerciseId: 'exercise2' }],
				languages: ['en', 'fr']
			})
		});

		// Mock updating the session fails
		fetchUpdateClassroomSession.mockResolvedValueOnce({ ok: false });

		const response = await POST({ request, cookies: mockCookies });

		expect(response.status).toBe(500);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: 'Failed to update session' });
	});
});
