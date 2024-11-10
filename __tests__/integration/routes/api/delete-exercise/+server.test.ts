import { describe, it, expect, vi } from 'vitest';
import { POST } from '$src/routes/api/delete-exercise/+server';
import { fetchDeleteExercise } from '$lib/fetchRequests';

const backendUrl = 'http://localhost:5015';

// Mock `handleAuthenticatedRequest`
vi.mock('$lib/fetchRequests', () => ({
	fetchDeleteExercise: vi.fn()
}));

global.fetch = vi.fn();

describe('POST /delete-exercise', () => {
	it('returns 200 with success message when deletion is successful', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-exercise', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: 123 })
		});

		// Mock successful response
		fetchDeleteExercise.mockResolvedValueOnce({ ok: true });

		const response = await POST({ request, cookies: mockCookies });

		// Verify response
		expect(response.status).toBe(200);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ message: 'Exercise deleted' });
	});

	it('returns 200 with success message when deletion is successful after refresh of access token', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? null : 'old_refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-exercise', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: 123 })
		});

		// Mock `fetchDeleteExercise` to return 401 on the first call and success on the second
		fetchDeleteExercise
			.mockResolvedValueOnce({ ok: false, status: 401 })
			.mockResolvedValueOnce({ ok: true });

		// Mock `fetch` for the refresh token endpoint
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				token: 'new_access_token',
				refreshToken: 'new_refresh_token',
				expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
			})
		});

		// Call POST handler
		const response = await POST({ request, cookies: mockCookies });
		const jsonResponse = await response.json();

		// Verify response status and content
		expect(response.status).toBe(200);
		expect(jsonResponse).toEqual({ message: 'Exercise deleted' });
		// Verify that access_token was refreshed
		expect(fetchDeleteExercise).toHaveBeenCalledTimes(2);
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

	it('returns 500 with error message when deletion fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-exercise', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: 123 })
		});

		// Mock failed response from `handleAuthenticatedRequest`
		fetchDeleteExercise.mockResolvedValue({
			ok: false
		});

		// Call POST handler
		const response = await POST({ request, cookies: mockCookies });

		// Verify response
		expect(response.status).toBe(500);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: 'Failed to delete exercise' });
	});
	it('redirects to /login if refresh_token is missing', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : null)), // No refresh token
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-exercise', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: 123 })
		});

		// Mock `fetchDeleteExercise` to return 401 on the first call
		fetchDeleteExercise.mockResolvedValueOnce({ ok: false, status: 401 });

		// Call POST handler and check for the expected redirect error
		try {
			await POST({ request, cookies: mockCookies });
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		// Verify that fetch was never called for the refresh route
		// because of invalid refresh token
		expect(fetch).not.toHaveBeenCalled();
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', {
			path: '/',
			secure: false
		});
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/', secure: false });
	});

	it('redirects to /login if refresh request fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'expired_token' : 'invalid_refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-exercise', {
			method: 'POST',
			body: JSON.stringify({ exercise_id: 123 })
		});

		// Mock `fetchDeleteExercise` to return 401 on the first call
		fetchDeleteExercise.mockResolvedValueOnce({ ok: false, status: 401 });

		// Mock `fetch` for the refresh token endpoint to fail
		fetch.mockResolvedValueOnce({ ok: false });

		// Call POST handler and check for the expected redirect error
		try {
			await POST({ request, cookies: mockCookies });
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		// Verify that the refresh endpoint was called once
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/', secure: false });
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/', secure: false });

		// Ensure tokens were deleted due to failed refresh
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', expect.any(Object));
	});
});
