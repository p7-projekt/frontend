import type { PageLoad } from './$types';
import { testCasesStore } from './testCasesStore';

export const load: PageLoad = ({ data }) => {
	const exerciseData = data.exerciseData;

	let testCaseSchema = {
		parameters: {
			input: [],
			output: []
		}
	};

	if (exerciseData) {
		const testCases = exerciseData.testCases.map((testCase: any, index: number) => ({
			...testCase,
			id: index + 1,
			parameters: {
				input: testCase.inputParams.map((value: any, index: number) => ({
					type: exerciseData.inputParameterType[index],
					value
				})),
				output: testCase.outputParams.map((value: any, index: number) => ({
					type: exerciseData.outputParamaterType[index],
					value
				}))
			}
		}));

		testCasesStore.set({
			idCounter: testCases.length,
			testCases
		});

		testCaseSchema = {
			parameters: {
				input: exerciseData.inputParameterType.map((type: string) => ({ type, value: '' })),
				output: exerciseData.outputParamaterType.map((type: string) => ({ type, value: '' }))
			}
		};
	}

	return { testCasesStore, data, testCaseSchema };
};
