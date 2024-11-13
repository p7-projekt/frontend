import { load, actions } from '../../../../src/routes/createexercise/+page.server';
import { describe, it, expect, vi } from 'vitest';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { redirect } from '@sveltejs/kit';

vi.mock('sveltekit-superforms', () => ({
    setError: vi.fn(),
    superValidate: vi.fn(() => ({
        valid: true,
        data: {
            title: 'Valid Title',
            description: 'Valid Description',
            codeText: 'Valid Code',
            testCases: [
                {
                    parameters: {
                        input: [{ type: 'string', value: 'input1' }],
                        output: [{ type: 'string', value: 'output1' }]
                    },
                    publicVisible: true
                }
            ]
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
    it('redirects on successful exercise creation', async () => {
        // Arrange
        vi.doMock('sveltekit-superforms', () => ({
            setError: vi.fn(),
            superValidate: vi.fn(() => ({
                valid: true,
                data: {
                    title: 'Exercise 1',
                    description: 'Description 1',
                    codeText: 'Solution 1',
                    testCases: [
                        {
                            parameters: {
                                input: [{ type: 'string', value: 'input1' }],
                                output: [{ type: 'string', value: 'output1' }]
                            },
                            publicVisible: true
                        }
                    ]
                }
            }))
        }));

        const formData = new FormData();
        formData.set('title', 'Test Exercise');
        formData.set('description', 'Test description');
        formData.set('codeText', 'Test code');
        formData.set('testCases', JSON.stringify([{ inputParams: ['input1'], outputParams: ['output1'], publicVisible: true }]));

        const mockCookies = {
            get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
            set: vi.fn(),
            delete: vi.fn()
        };

        const mockResponse = {
            ok: true,
            text: vi.fn().mockResolvedValueOnce(JSON.stringify({ isFailed: false }))
        };

        handleAuthenticatedRequest.mockResolvedValueOnce(mockResponse);

        const request = { formData: async () => formData };

        const mockUrl = {
            searchParams: {
                get: vi.fn((param) => {
                    if (param === 'exerciseid') return '1';
                    if (param === 'edit') return 'true';
                    return null;
                })
            }
        };

        const event = {
            request,
            cookies: mockCookies,
            url: mockUrl
        };

        // Act and Assert
        await expect(actions.default(event)).rejects.toThrow();
        expect(redirect).toHaveBeenCalledWith(303, '/');

        // Verify the body passed to handleAuthenticatedRequest
        expect(handleAuthenticatedRequest).toHaveBeenCalledWith(
            expect.any(Function), // We expect a function to be passed
            'valid_token',
            'refresh_token',
            mockCookies
        );

        // Verify the response text method was called
        expect(mockResponse.text).toHaveBeenCalled();
    });
});