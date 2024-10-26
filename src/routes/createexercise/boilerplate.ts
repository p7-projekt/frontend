import { haskell } from "@codemirror/legacy-modes/mode/haskell";



export function setIDEBoilerPlate(testTemplate: { parameters: { input: { type: string, value: string }[], output: { type: string, value: string }[] } }, language: string = "haskell") {
	if (language === "haskell") {
        return createHaskellBoilerplate(testTemplate); 
    }

	return "hello";
}

function createHaskellBoilerplate(testTemplate: { parameters: { input: { type: string, value: string }[], output: { type: string, value: string }[] } }) {
    let inputs = testTemplate.parameters.input.map((input, index) => {
        return `input${index} = ${input.value}`;
    }).join("\n");

    let outputs = testTemplate.parameters.output.map((output, index) => {
        return `output${index} = ${output.value}`;
    }).join("\n");

    let functionSignature = `solve :: ${testTemplate.parameters.input.map((input, index) => {
        return `${input.type}`;
    }).join(" -> ")} -> ${testTemplate.parameters.output.map((output, index) => {
        return `${output.type}`;
    }).join(" -> ")}`;

    let functionBody = `solve ${testTemplate.parameters.input.map((input, index) => {
        return `input${index}`;
    }).join(" ")} = ${testTemplate.parameters.output.map((output, index) => {
        return `output${index}`;
    }).join(" ")}`;

    return `${inputs}\n${outputs}\n${functionSignature}\n${functionBody}`;    
   
}