import { load, actions } from '$src/routes/createexercise/+page.server';
import { describe, it, expect, vi } from 'vitest';

vi.mock('sveltekit-superforms', () => ({
	setError: vi.fn(),
	superValidate: vi.fn(() => ({
		data: {
			title: '',
			description: '',
			codeText: '',
			testCases: []
		}
	}))
}));

vi.mock('$lib/fetchRequests', () => ({
	fetchLanguageData: vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve()
		})
	)
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
		expect(result).toEqual({ form: expect.any(Object), exerciseData: null });
	});

	it('Loads exercise data correctly if url parameter is provided', async () => {
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
			outputParameterType: ['string']
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

		const result = await actions.default({ request, cookies: mockCookies });

		expect(result.status).toBe(400);
	});
});
