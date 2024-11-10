import { describe, test, expect, vi } from 'vitest';
import { handleAuthenticatedRequest } from '../../../src/lib/requestHandler';

// Mock the environment variables and fetch
const backendUrl = 'http://localhost:5015';

// Mock fetch globally
global.fetch = vi.fn();

describe('handleAuthenticatedRequest', () => {
	const access_token = 'mocked_access_token';
	const refresh_token = 'mocked_refresh_token';

	// Mock cookies with set and delete methods
	const mockCookies = {
		get: vi.fn().mockReturnValue(access_token), // Mock `get` to return the token
		getAll: vi.fn(),
		set: vi.fn(),
		delete: vi.fn(),
		serialize: vi.fn()
	};

	test('should return the response when access_token is valid', async () => {
		const requestFunction = vi.fn().mockResolvedValue({ ok: true });

		const result = await handleAuthenticatedRequest(
			requestFunction,
			access_token,
			refresh_token,
			mockCookies
		);

		expect(result.ok).toBe(true);
		expect(requestFunction).toHaveBeenCalledWith(access_token);
		expect(mockCookies.set).not.toHaveBeenCalled();
		expect(mockCookies.delete).not.toHaveBeenCalled();
	});

	test('should refresh token and retry request on 401 status', async () => {
		const new_access_token = 'new_access_token';
		const requestFunction = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 });
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					token: new_access_token,
					refreshToken: 'new_refresh_token',
					expiresAt: new Date().toISOString()
				})
		});

		await handleAuthenticatedRequest(requestFunction, access_token, refresh_token, mockCookies);

		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(requestFunction).toHaveBeenCalledTimes(2);
		expect(requestFunction).toHaveBeenCalledWith(new_access_token);
		expect(mockCookies.set).toHaveBeenCalledTimes(2);
	});

	test('should delete tokens and redirect if refresh fails', async () => {
		const requestFunction = vi.fn().mockResolvedValue({ ok: false, status: 401 });
		fetch.mockResolvedValueOnce({ ok: false });

		try {
			await handleAuthenticatedRequest(requestFunction, access_token, refresh_token, mockCookies);
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		expect(fetch).toHaveBeenCalledWith(`${backendUrl}/refresh`, expect.any(Object));
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/', secure: false });
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/', secure: false });
	});

	test('should delete tokens and redirect on 401 without refresh_token', async () => {
		const requestFunction = vi.fn().mockResolvedValue({ ok: false, status: 401 });

		try {
			await handleAuthenticatedRequest(requestFunction, access_token, null, mockCookies);
		} catch (error) {
			expect(error.status).toBe(303);
			expect(error.location).toBe('/login');
		}

		expect(requestFunction).toHaveBeenCalledWith(access_token);
		expect(mockCookies.delete).toHaveBeenCalledWith('access_token', { path: '/', secure: false });
		expect(mockCookies.delete).toHaveBeenCalledWith('refresh_token', { path: '/', secure: false });
	});
	test('should return invalid response when no refresh token and not status 401 or 404', async () => {
		const requestFunction = vi.fn().mockResolvedValue({ ok: false, status: 500 });

		await handleAuthenticatedRequest(requestFunction, access_token, null, mockCookies);

		expect(requestFunction).toHaveBeenCalledWith(access_token);
	});
});
