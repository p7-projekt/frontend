import { describe, it, expect, vi } from 'vitest';
import { actions } from '$src/routes/join/+page.server';
import { fail, redirect } from '@sveltejs/kit';

vi.mock('@sveltejs/kit', () => ({
    fail: vi.fn(),
    redirect: vi.fn(() => {
        throw new Error('Redirect triggered'); // Make redirect throw an error for easier testing
    })
}));

global.fetch = vi.fn();

describe('Join action', () => {
    const mockCookies = {
        get: vi.fn(() => 'anon_token'),
        set: vi.fn(),
        delete: vi.fn()
    };

    it('returns a validation error if session code is invalid', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'ABC123'); // Invalid format
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        await actions.join({ request: mockRequest, cookies: mockCookies });
        expect(fail).toHaveBeenCalledWith(400, {
            error: 'Session code must start with 2 uppercase letters followed by 4 digits'
        });
    });

    it('fails if session code length is incorrect', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'A123'); // Invalid length
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        await actions.join({ request: mockRequest, cookies: mockCookies });
        expect(fail).toHaveBeenCalledWith(400, {
            error: 'Session code must be exactly 6 characters'
        });
    });

    it('fails if session code last four digits are out of range', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'AB0999'); // Out of range
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        await actions.join({ request: mockRequest, cookies: mockCookies });
        expect(fail).toHaveBeenCalledWith(400, {
            error: 'The last 4 digits must be a number between 1000 and 9999'
        });
    });

    it('returns validation error if join request fails with invalid code error', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'AB1234'); // Valid code format
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ errors: { SessionCode: ['Invalid code'] } })
        });

        await actions.join({ request: mockRequest, cookies: mockCookies });
        expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid code' });
    });

    it('returns validation error if join request fails with no error', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'AB1234'); // Valid code format
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ errors: null })
        });

        await actions.join({ request: mockRequest, cookies: mockCookies });
        expect(fail).toHaveBeenCalledWith(400, { error: 'Invalid code' });
    });

    it('returns server error if no token is received', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'AB1234'); // Valid code format
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        });

        await actions.join({ request: mockRequest, cookies: mockCookies });
        expect(fail).toHaveBeenCalledWith(500, { message: 'Server error. Please try again later.' });
    });

    it('sets anon_token cookie and redirects on successful join', async () => {
        const mockFormData = new FormData();
        mockFormData.set('sessionCode', 'AB1234'); // Valid code format
        mockFormData.set('nickname', 'ValidNick'); // Valid nickname

        const mockRequest = {
            formData: async () => mockFormData
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                token: 'valid_token',
                expiresAt: '2024-12-31T23:59:59Z'
            })
        });

        // Use rejects.toThrow to handle the async redirect correctly
        await expect(actions.join({ request: mockRequest, cookies: mockCookies })).rejects.toThrow();

        // Check that cookies are set correctly
        expect(mockCookies.set).toHaveBeenCalledWith('anon_token', 'valid_token', {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: new Date('2024-12-31T23:59:59Z')
        });

        // Verify that redirect was called with correct path
        expect(redirect).toHaveBeenCalledWith(303, '/session');
    });
});