export const convertFormData = (formData) => {
	return {
		name: formData.title,
		description: formData.description,
		solution: formData.codeText,
		inputParameterType: formData.testCases[0].parameters.input.map((param: any) => param.type),
		outputParamaterType: formData.testCases[0].parameters.output.map((param: any) => param.type),
		testcases: formData.testCases.map((testCase: any) => ({
			inputParams: testCase.parameters.input.map((param: any) => param.value),
			outputParams: testCase.parameters.output.map((param: any) => param.value),
			publicVisible: testCase.publicVisible
		}))
	};
};