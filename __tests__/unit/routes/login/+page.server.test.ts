import { load, actions } from '$src//routes/login/+page.server';
import { describe, it, expect, vi } from 'vitest';
import { redirect } from '@sveltejs/kit';

vi.mock('sveltekit-superforms', () => ({
	setError: vi.fn(),
	superValidate: vi.fn(() => ({
		valid: true,
		data: {
			email: 'madabc@madabc.dk',
			password: 'madabc'
		}
	}))
}));

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	fail: vi.fn((status, body) => ({ status, body }))
}));

vi.mock('sveltekit-superforms/adapters', () => ({
	zod: vi.fn()
}));

vi.mock('$lib/requestHandler', () => ({
	handleAuthenticatedRequest: vi.fn()
}));

describe('login load function (useless)', () => {
	it('form is returned', async () => {
		const result = await load();
		expect(result.form).toEqual({
			valid: true,
			data: {
				email: 'madabc@madabc.dk',
				password: 'madabc'
			}
		});
	});
});

describe('login action function', () => {
	it('form is posted', async () => {
		const event = {
			cookies: {
				get: vi.fn(),
				set: vi.fn(),
				delete: vi.fn()
			}
		};

		global.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						token: 'access_token',
						refreshToken: 'refresh_token',
						expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
					})
			})
		);

		// Act
		await expect(actions.default(event)).rejects.toThrow();

		// Assert
		expect(redirect).toHaveBeenCalledWith(303, '/');
	});
});
