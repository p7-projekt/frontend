import { describe, it, expect } from 'vitest';
import { convertFormData } from '$src/routes/createexercise/helpers';

describe('convertFormData', () => {
	it('should convert form data to API format correctly', () => {
		const formData = {
			title: 'Test Title',
			description: 'Test Description',
			codeText: 'Test Code',
			selectedLanguage: {
				languageId: 1,
				language: 'haskell'
			},
			testCases: [
				{
					parameters: {
						input: [
							{ type: 'int', value: '1' },
							{ type: 'string', value: 'test' }
						],
						output: [{ type: 'bool', value: 'true' }]
					},
					publicVisible: true
				}
			]
		};

		const expectedApiData = {
			name: 'Test Title',
			description: 'Test Description',
			solution: 'Test Code',
			solutionLanguage: 1,
			inputParameterType: ['int', 'string'],
			outputParamaterType: ['bool'],
			testcases: [
				{
					inputParams: ['1', 'test'],
					outputParams: ['true'],
					publicVisible: true
				}
			]
		};

        const apiData = convertFormData(formData);
        expect(apiData).toEqual(expectedApiData);
    });
});
