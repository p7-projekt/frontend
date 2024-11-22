import { load, actions } from '$src/routes/login/+page.server';
import { describe, it, expect, vi } from 'vitest'; 
import { redirect, fail } from '@sveltejs/kit';
import { setError } from 'sveltekit-superforms';
 
vi.mock('sveltekit-superforms', () => ({
    setError: vi.fn(),
    superValidate: vi.fn(() => ({
        valid: true,
        data: {
            email: 'madabc@madabc.dk',
            password: 'madabc'
        }
    })), 
}));

vi.mock('sveltekit-superforms/adapters', () => ({
    zod: vi.fn(),
}));

vi.mock('@sveltejs/kit', () => ({
    redirect: vi.fn(),
    fail: vi.fn((status, body) => ({ status, body }))
}));

describe('login action function', () => { 
    it('form is posted and fails', async () => {
        const event = {
            request: {
                formData: async () => {
                    const formData = new FormData();
                    formData.set('email', 'madabc@madabc.dk');
                    formData.set('password', 'madabc');
                    return formData;
                }
            },
            cookies: {
                get: vi.fn(),
                set: vi.fn(),
                delete: vi.fn()
            },
            url: new URL('http://localhost')
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
                    detail: 'Invalid credentials'
                })
            })
        );

        // Act
        const result = await actions.default(event);

        // Assert 
        expect(setError).toHaveBeenCalledWith(expect.any(Object), 'password', 'Invalid credentials');
       
    });
});