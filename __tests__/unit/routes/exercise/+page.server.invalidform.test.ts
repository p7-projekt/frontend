import { actions } from '../../../../src/routes/exercise/+page.server';
import { describe, it, expect, vi } from 'vitest';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { setError } from 'sveltekit-superforms';
import { redirect } from '@sveltejs/kit';

vi.mock('sveltekit-superforms', () => ({
    setError: vi.fn(),
    superValidate: vi.fn(() => ({
        valid: false,
        data: {
            title: '',
            description: 'Test description',
            codeText: '',
            testCases: []
        }
    }))
}));

vi.mock('@sveltejs/kit', () => ({
    redirect: vi.fn(),
    fail: vi.fn((status, body) => ({ status, body }))
}));

vi.mock('sveltekit-superforms/adapters', () => ({
    zod: vi.fn(),
}));

vi.mock('$lib/requestHandler', () => ({
    handleAuthenticatedRequest: vi.fn()
}));

describe('Page Server Actions function', () => {
    it('Return 400 if form is invalid', async () => {
        const formData = new FormData();
        formData.set('title', '');
        formData.set('description', 'Test description');

        const mockCookies = {
            get: vi.fn(() => 'valid_token'),
            set: vi.fn(),
            delete: vi.fn()
        };

        const request = {
            formData: async () => formData
        };
        const mockUrl = {
            searchParams: {
                get: vi.fn((param) => {
                    if (param === 'exerciseid') return '1';
                    if (param === 'seshid') return '1';
                    return null;
                })
            }
        };

        const mockResponse = {
            ok: false,
            text: vi.fn().mockResolvedValueOnce(JSON.stringify({ errors: { codeText: ['An error occurred on the server'] } }))
        };

        handleAuthenticatedRequest.mockResolvedValueOnce(mockResponse);

        const result = await actions.default({ request, url: mockUrl, cookies: mockCookies });

        expect(result.status).toBe(400);
    });
});