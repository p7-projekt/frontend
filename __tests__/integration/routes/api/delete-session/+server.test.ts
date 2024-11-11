import { describe, it, expect, vi } from 'vitest';
import { POST } from '$src/routes/api/delete-session/+server';
import { fetchDeleteSession } from '$lib/fetchRequests';

const backendUrl = 'http://localhost:5015';

// Mock `fetchDeleteSession`
vi.mock('$lib/fetchRequests', () => ({
	fetchDeleteSession: vi.fn()
}));

global.fetch = vi.fn();

describe('POST /delete-session', () => {
	it('returns 200 with success message when session deletion is successful', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-session', {
			method: 'POST',
			body: JSON.stringify({ session_id: 123 })
		});

		// Mock successful response
		fetchDeleteSession.mockResolvedValueOnce({ ok: true });

		const response = await POST({ request, cookies: mockCookies });

		// Verify response
		expect(response.status).toBe(200);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ message: 'Session deleted' });
	});

	it('returns 200 with success message after refreshing access token', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? null : 'old_refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-session', {
			method: 'POST',
			body: JSON.stringify({ session_id: 123 })
		});

		// Mock `fetchDeleteSession` to return 401 initially, then success
		fetchDeleteSession
			.mockResolvedValueOnce({ ok: false, status: 401 })
			.mockResolvedValueOnce({ ok: true });

		// Mock `fetch` for refresh endpoint
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
		expect(jsonResponse).toEqual({ message: 'Session deleted' });
		expect(fetchDeleteSession).toHaveBeenCalledTimes(2);
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

	it('returns 500 with error message when session deletion fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-session', {
			method: 'POST',
			body: JSON.stringify({ session_id: 123 })
		});

		fetchDeleteSession.mockResolvedValueOnce({ ok: false });

		const response = await POST({ request, cookies: mockCookies });

		expect(response.status).toBe(500);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({ error: 'Failed to delete session' });
	});

	it('redirects to /login if refresh_token is missing', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : null)),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-session', {
			method: 'POST',
			body: JSON.stringify({ session_id: 123 })
		});

		fetchDeleteSession.mockResolvedValueOnce({ ok: false, status: 401 });

		try {
			await POST({ request, cookies: mockCookies });
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		expect(fetch).not.toHaveBeenCalled();
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/', secure: false });
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', {
			path: '/',
			secure: false
		});
	});

	it('redirects to /login if refresh request fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'expired_token' : 'invalid_refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};
		const request = new Request('http://localhost/delete-session', {
			method: 'POST',
			body: JSON.stringify({ session_id: 123 })
		});

		fetchDeleteSession.mockResolvedValueOnce({ ok: false, status: 401 });
		fetch.mockResolvedValueOnce({ ok: false });

		try {
			await POST({ request, cookies: mockCookies });
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', expect.any(Object));
	});
});
