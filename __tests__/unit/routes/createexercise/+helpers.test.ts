import { describe, it, expect } from 'vitest';
import { convertFormData } from '../../../../src/routes/createexercise/helpers';

describe('convertFormData', () => {
	it('should convert form data to API format correctly', () => {
		const formData = {
			title: 'Test Title',
			description: 'Test Description',
			codeText: 'Test Code',
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

		const result = convertFormData(formData);
		expect(result).toEqual(expectedApiData);
	});
});
