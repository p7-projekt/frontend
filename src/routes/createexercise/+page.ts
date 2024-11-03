import { writable } from 'svelte/store';
import type { PageLoad } from './$types';

const testCasesStore = writable<{ idCounter: number; testCases: any[] }>({
	idCounter: 0,
	testCases: []
});

export const load: PageLoad = ({ data }) => {
    const exerciseData = data.exerciseData;

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
    }

    return { testCasesStore, data };
};
