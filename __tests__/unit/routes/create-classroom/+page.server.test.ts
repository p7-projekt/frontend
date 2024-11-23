import { describe, it, expect, vi } from 'vitest';
import { actions } from '$src/routes/create-classroom/+page.server';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	fail: vi.fn((status, body) => ({ status, body }))
}));

vi.mock('$lib/fetchRequests', () => ({
	fetchCreateClassroom: vi.fn()
}));

vi.mock('$lib/requestHandler', () => ({
	handleAuthenticatedRequest: vi.fn()
}));

describe('Classroom Creation Actions', () => {
	it('fails if classroom title is missing', async () => {
		const formData = new FormData();
		formData.set('classroom-description', 'Test description');

		const mockCookies = {
			get: vi.fn(() => 'valid_token'),
			set: vi.fn(),
			delete: vi.fn()
		};

		const request = { formData: async () => formData };

		const result = await actions.default({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
		expect(result.body.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: 'invalid_type',
					expected: 'string',
					message: 'Expected string, received null',
					path: ['title']
				})
			])
		);
		expect(result.body.classroom_description).toBe('Test description');
	});

	it('redirects on successful classroom creation', async () => {
		const formData = new FormData();
		formData.set('classroom-title', 'Test Classroom');
		formData.set('classroom-description', 'A test description');

		const mockCookies = {
			get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		handleAuthenticatedRequest.mockResolvedValueOnce({ ok: true });

		const request = { formData: async () => formData };

		await expect(actions.default({ request, cookies: mockCookies })).rejects.toThrow();
		expect(redirect).toHaveBeenCalledWith(303, '/');

		expect(handleAuthenticatedRequest).toHaveBeenCalledWith(
			expect.any(Function),
			'valid_token',
			'refresh_token',
			mockCookies
		);
	});
});
