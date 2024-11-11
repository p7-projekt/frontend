import { describe, it, expect, vi } from 'vitest';
import { load } from '$src/routes/session/+page.server';
import { redirect } from '@sveltejs/kit';
import { get_anon_userID } from '$src/routes/session/session';

vi.mock('$src/routes/session/session', () => ({
	get_anon_userID: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn()
}));

global.fetch = vi.fn();

describe('Page Server Load function', () => {
	it('redirects to /join when no anon_token is available', async () => {
		const mockCookies = {
			get: vi.fn(() => null),
			set: vi.fn(),
			delete: vi.fn()
		};

		await expect(load({ cookies: mockCookies })).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/join');
	});

	it('deletes anon_token and redirects to /join on 401 response', async () => {
		const mockCookies = {
			get: vi.fn(() => 'valid_anon_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		get_anon_userID.mockReturnValue('Uncle Bob');
		fetch.mockResolvedValueOnce({ ok: false, status: 401 });

		await expect(load({ cookies: mockCookies })).rejects.toThrow();
		expect(mockCookies.delete).toHaveBeenCalledWith('anon_token', { path: '/', secure: false });
		expect(redirect).toHaveBeenCalledWith(303, '/join');
	});
	it('deletes anon_token and redirects to /join on other response', async () => {
		const mockCookies = {
			get: vi.fn(() => 'valid_anon_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		get_anon_userID.mockReturnValue('Uncle Bob');
		fetch.mockResolvedValueOnce({ ok: false, status: 404 });

		await expect(load({ cookies: mockCookies })).rejects.toThrow();
		expect(mockCookies.delete).toHaveBeenCalledWith('anon_token', { path: '/', secure: false });
		expect(redirect).toHaveBeenCalledWith(303, '/join');
	});

	it('redirects to /session/[id] on successful user data fetch', async () => {
		const mockCookies = {
			get: vi.fn(() => 'valid_anon_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		get_anon_userID.mockReturnValue('Uncle Bob');
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ sessionId: '7' })
		});

		await expect(load({ cookies: mockCookies })).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/session/7');
	});
});
