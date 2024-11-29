import { load, actions } from '$src//routes/exercise/+page.server';
import { describe, it, expect, vi } from 'vitest';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { redirect } from '@sveltejs/kit';

vi.mock('sveltekit-superforms', () => ({
	setError: vi.fn(),
	superValidate: vi.fn(() => ({
		valid: true,
		data: {
			codeText: 'Valid Code',
			selectedLanguage: {
				parameters: {
					languageId: 1,
					language: 'Haskell'
				},
				publicVisible: true
			}
		}
	}))
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
	it('Loads exercise data correctly if url parameter is provided', async () => {
		// Arrange
		const cookies = {
			get: vi.fn().mockReturnValue('mock_access_token')
		};
		const url = {
			searchParams: {
				get: vi.fn().mockReturnValue('mock_exercise_id')
			}
		};

		global.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						title: 'Exercise 1',
						description: 'Description 1',
						inputParameterType: ['string'],
						outputParamaterType: ['string'],
						testCases: [
							{
								inputParams: ['input1'],
								outputParams: ['output1'],
								publicVisible: true
							}
						]
					}),
				text: () =>
					Promise.resolve(
						JSON.stringify({
							title: 'Exercise 1',
							description: 'Description 1',
							inputParameterType: ['string'],
							outputParamaterType: ['string'],
							testCases: [
								{
									inputParams: ['input1'],
									outputParams: ['output1'],
									publicVisible: true
								}
							]
						})
					)
			})
		);

		// Act
		const result = await load({ cookies, url });

		// Assert
		expect(result).toEqual({
			form: {
				valid: true,
				data: {
					codeText: 'Valid Code',
					selectedLanguage: {
						parameters: {
							languageId: 1,
							language: 'Haskell'
						},
						publicVisible: true
					}
				}
			},
			exerciseData: {
				title: 'Exercise 1',
				description: 'Description 1',
				inputParameterType: ['string'],
				outputParamaterType: ['string'],
				testCases: [
					{
						inputParams: ['input1'],
						outputParams: ['output1'],
						publicVisible: true
					}
				]
			},
			languages: [],
			testTemplate: {
				parameters: {
					input: [
						{
							type: 'string',
							value: 'input1'
						}
					],
					output: [
						{
							type: 'string',
							value: 'output1'
						}
					]
				}
			}
		});
	});
});

describe('Page Server Actions function', () => {
	it('redirects on successful exercise creation', async () => {
		// Arrange
		const formData = new FormData();
		formData.set('title', 'Test Exercise');
		formData.set('description', 'Test description');
		formData.set('codeText', 'Test code');
		formData.set(
			'testCases',
			JSON.stringify([{ inputParams: ['input1'], outputParams: ['output1'], publicVisible: true }])
		);

		const mockCookies = {
			get: vi.fn((name) => (name === 'anon_token' ? 'valid_token' : 'refresh_token')),
			set: vi.fn(),
			delete: vi.fn()
		};

		global.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				text: () => Promise.resolve(JSON.stringify({ isFailed: false }))
			})
		);

		const request = { formData: async () => formData };

		const mockUrl = {
			searchParams: {
				get: vi.fn((param) => {
					if (param === 'exerciseid') return '1';
					if (param === 'seshid') return '1';
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
		expect(redirect).toHaveBeenCalledWith(303, '/session');
	});
});
