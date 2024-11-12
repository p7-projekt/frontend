import { load, actions } from '../../../../src/routes/createexercise/+page.server';
import { describe, it, expect, vi } from 'vitest';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

vi.mock('sveltekit-superforms', () => ({
    setError: vi.fn(),
    superValidate: vi.fn()
}));

vi.mock('sveltekit-superforms/adapters', () => ({
    zod: vi.fn(),
}));

vi.mock('$lib/requestHandler', () => ({
    handleAuthenticatedRequest: vi.fn()
}));

describe('Page Server Load function', () => {
    const mockDepends = vi.fn();

    it('exerciseData is null when no url parameters are provided', async () => {
        const mockCookies = {
            get: vi.fn(() => null),
            set: vi.fn(),
            delete: vi.fn()
        };

        const mockUrl = {
            searchParams: {
                get: vi.fn(() => null)
            }
        };

        const result = await load({ url: mockUrl, cookies: mockCookies, depends: mockDepends });
        expect(result).toEqual({ form: undefined, exerciseData: null });
    });

    it('fetches instructor exercises successfully', async () => {
        // Arrange
        const mockCookies = {
            get: vi.fn((name) => (name === 'access_token' ? 'valid_token' : 'refresh_token')),
            set: vi.fn(),
            delete: vi.fn()
        };

        const mockUrl = {
            searchParams: {
                get: vi.fn((param) => (param === 'exerciseid' ? '1' : null))
            }
        };

        const mockExerciseData = {
            title: 'Exercise 1',
            description: 'Description 1',
            solution: 'Solution 1',
            testCases: [
                {
                    inputParams: ['input1'],
                    outputParams: ['output1'],
                    publicVisible: true
                }
            ],
            inputParameterType: ['string'],
            outputParamaterType: ['string']
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve(JSON.stringify(mockExerciseData))
            })
        );

        // Act
        const result = await load({ url: mockUrl, cookies: mockCookies, depends: mockDepends });

        // Assert
        expect(result).toEqual({
            form: expect.any(Object),
            exerciseData: mockExerciseData
        });
    });
});