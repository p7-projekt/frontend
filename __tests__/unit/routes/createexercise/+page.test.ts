import { load } from '../../../../src/routes/createexercise/+page';
import { testCasesStore } from '../../../../src/routes/createexercise/testCasesStore';
import { get } from 'svelte/store';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Page Load function', () => {
	beforeEach(() => {
		// Reset the store before each test
		testCasesStore.set({ idCounter: 0, testCases: [] });
	});

	it('should return default values when no exerciseData is provided', () => {
		const data = {};
		const result = load({ data });

		expect(result.data).toEqual(data);
		expect(result.testCaseSchema).toEqual({
			parameters: {
				input: [],
				output: []
			}
		});

		const storeValue = get(testCasesStore);
		expect(storeValue).toEqual({ idCounter: 0, testCases: [] });
	});

	it('should populate testCasesStore and testCaseSchema when exerciseData is provided', () => {
		const exerciseData = {
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

		const data = { exerciseData };
		const result = load({ data });

		expect(result.data).toEqual(data);
		expect(result.testCaseSchema).toEqual({
			parameters: {
				input: [{ type: 'string', value: '' }],
				output: [{ type: 'string', value: '' }]
			}
		});

		const storeValue = get(testCasesStore);
		expect(storeValue).toEqual({
			idCounter: 1,
			testCases: [
				{
					id: 1,
					inputParams: ['input1'],
					outputParams: ['output1'],
					publicVisible: true,
					parameters: {
						input: [{ type: 'string', value: 'input1' }],
						output: [{ type: 'string', value: 'output1' }]
					}
				}
			]
		});
	});
});
