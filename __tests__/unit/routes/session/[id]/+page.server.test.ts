import { describe, it, expect, vi } from 'vitest';
import { load } from '$src/routes/session/[id]/+page.server';
import { error, redirect } from '@sveltejs/kit';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

vi.mock('$lib/requestHandler', () => ({
	handleAuthenticatedRequest: vi.fn()
}));

vi.mock('$lib/fetchRequests', () => ({
	fetchSpecificSession: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	error: vi.fn()
}));

const mockParams = { id: '7' };
const mockUrl = {
	searchParams: {
		get: vi.fn(() => null)
	}
};

global.fetch = vi.fn();

describe('Page Server Load function', () => {
	it('redirects to /join when no anon_token is available', async () => {
		const mockCookies = {
			get: vi.fn(() => null),
			set: vi.fn(),
			delete: vi.fn()
		};

		await expect(
			load({ cookies: mockCookies, params: mockParams, url: mockUrl })
		).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/join');
	});

	it('throw error on 404 response', async () => {
		const mockCookies = {
			get: vi.fn((name) =>
				name === 'anon_token' || name === 'access_token' ? 'valid_token' : 'refresh_token'
			),
			set: vi.fn(),
			delete: vi.fn()
		};

		fetch.mockResolvedValueOnce({ ok: false, status: 404 });

		await expect(
			load({ cookies: mockCookies, params: mockParams, url: mockUrl })
		).rejects.toThrow();
		expect(error).toHaveBeenCalledWith(404, 'Session not found');
	});
	it('deletes anon_token and redirects to /join on other response', async () => {
		const mockCookies = {
			get: vi.fn(() => 'valid_anon_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		fetch.mockResolvedValueOnce({ ok: false, status: 401 });

		await expect(
			load({ cookies: mockCookies, params: mockParams, url: mockUrl })
		).rejects.toThrow();
		expect(mockCookies.delete).toHaveBeenCalledWith('anon_token', { path: '/', secure: false });
		expect(redirect).toHaveBeenCalledWith(303, '/join');
	});

	it('returns anonymous session when response is successful', async () => {
		const mockCookies = {
			get: vi.fn(() => 'valid_anon_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				title: 'Krath Session',
				description: 'Rust is better than everything',
				author: 'Krath',
				sessionExpiresUtc: '2024-11-11T15:04:26.515Z',
				exercises: [
					{
						id: 1,
						name: 'I hate Python',
						solved: false
					}
				]
			})
		});

		const result = await load({ cookies: mockCookies, params: mockParams, url: mockUrl });
		expect(result).toEqual({
			session: {
				title: 'Krath Session',
				description: 'Rust is better than everything',
				author: 'Krath',
				sessionExpiresUtc: '2024-11-11T15:04:26.515Z',
				exercises: [
					{
						id: 1,
						name: 'I hate Python',
						solved: false
					}
				]
			}
		});
	});
	it('returns instructor session when response is successful', async () => {
		const mockCookies = {
			get: vi.fn((name) =>
				name === 'access_token' ? 'valid_token' : name === 'refresh_token' ? 'refresh_token' : null
			),
			set: vi.fn(),
			delete: vi.fn()
		};

		handleAuthenticatedRequest.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				title: 'Krath Session',
				description: 'Rust is better than everything',
				author: 'Krath',
				sessionExpiresUtc: '2024-11-11T15:04:26.515Z',
				exercises: [
					{
						id: 1,
						name: 'I hate Python',
						solved: false
					}
				]
			})
		});

		const result = await load({ cookies: mockCookies, params: mockParams, url: mockUrl });
		expect(result).toEqual({
			session: {
				title: 'Krath Session',
				description: 'Rust is better than everything',
				author: 'Krath',
				sessionExpiresUtc: '2024-11-11T15:04:26.515Z',
				exercises: [
					{
						id: 1,
						name: 'I hate Python',
						solved: false
					}
				]
			}
		});
	});
});
