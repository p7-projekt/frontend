import { describe, it, expect, vi } from 'vitest';
import { load } from '$src/routes/+layout.server';
import { fetchUserData } from '$lib/fetchRequests';

const backendUrl = 'http://localhost:5015';
const api_version = 'v1';

// Mock the required modules
vi.mock('$lib/fetchRequests', () => ({
	fetchUserData: vi.fn()
}));

global.fetch = vi.fn();

describe('Layout Server Load Function', () => {
	it('returns user as null when no tokens are available', async () => {
		const mockCookies = {
			get: vi.fn(() => null),
			set: vi.fn(),
			delete: vi.fn()
		};

		const result = await load({ cookies: mockCookies });

		expect(result).toEqual({ user: null });
	});

	it('fetches user data successfully when access token is valid', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		const mockUserData = { name: 'John Doe' };
		fetchUserData.mockResolvedValueOnce({ ok: true, json: async () => mockUserData });

		const result = await load({ cookies: mockCookies });

		expect(result).toEqual({ user: { name: 'John Doe' } });
		expect(fetchUserData).toHaveBeenCalledWith(backendUrl, api_version, 'valid_token');
	});

	it('refreshes access token and fetch user data if access token is expired', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'expired_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		const mockUserData = { name: 'Jane Doe' };
		fetchUserData
			.mockResolvedValueOnce({ ok: false, status: 401 })
			.mockResolvedValueOnce({ ok: true, json: async () => mockUserData });

		// Mock `fetch` for refresh endpoint
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				token: 'new_access_token',
				refreshToken: 'new_refresh_token',
				expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
			})
		});

		const result = await load({ cookies: mockCookies });
		expect(result).toEqual({ user: { name: 'Jane Doe' } });
		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(fetchUserData).toHaveBeenCalledWith(backendUrl, api_version, 'new_access_token');

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

	it('returns user as null when user data fetch fails', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		// Simulate failed user data fetch
		fetchUserData.mockResolvedValueOnce({ ok: false });

		const result = await load({ cookies: mockCookies });

		expect(result).toEqual({ user: null });
		expect(fetchUserData).toHaveBeenCalledWith(backendUrl, expect.any(String), 'valid_token');
	});

	it('redirects to /login if refresh_token is missing', async () => {
		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : null)),
			set: vi.fn(),
			delete: vi.fn()
		};
		// Simulate failed user data fetch
		fetchUserData.mockResolvedValueOnce({ ok: false, status: 401 });

		try {
			await load({ cookies: mockCookies });
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

		fetchUserData.mockResolvedValueOnce({ ok: false, status: 401 });
		fetch.mockResolvedValueOnce({ ok: false });

		try {
			await load({ cookies: mockCookies });
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', expect.any(Object));
	});
});
