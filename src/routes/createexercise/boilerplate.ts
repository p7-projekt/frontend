import { haskell } from '@codemirror/legacy-modes/mode/haskell';
import { string } from 'zod';

export function setIDEBoilerPlate(
	testTemplate: {
		parameters: {
			input: { type: string; value: string }[];
			output: { type: string; value: string }[];
		};
	},
	language: string = 'haskell'
) {
	if (language === 'haskell') {
		return createHaskellBoilerplate(testTemplate);
	}

	return 'hello';
}

function createHaskellBoilerplate(testTemplate: {
	parameters: {
		input: { type: string; value: string }[];
		output: { type: string; value: string }[];
	};
}) {
	let module = `module Solution where`;

	let functionSignature = `solution :: ${testTemplate.parameters.input
		.map((input) => {
			return `${input.type}`;
		})
		.join(' -> ')} -> ${testTemplate.parameters.output
		.map((output) => {
			return `${output.type}`;
		})
		.join(' -> ')}`;

	let functionBody = `solution ${testTemplate.parameters.input
		.map((input, index) => {
			return `input${index}`;
		})
		.join(' ')} = ${testTemplate.parameters.output
		.map((output, index) => {
			return `output${index}`;
		})
		.join(' ')}`;

	return `${module}\n${functionSignature}\n${functionBody}`;
}
