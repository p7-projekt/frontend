export function setIDEBoilerPlate(
    testTemplate: {
        parameters: {
            input: { type: string; value: string }[];
            output: { type: string; value: string }[];
        };
    },
    language: string = 'haskell'
) {
    switch (language.toLowerCase()) {
        case 'haskell':
            return createHaskellBoilerplate(testTemplate);
        case 'python':
            return createPythonBoilerplate(testTemplate);
        default:
            return 'select a language';
    }
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
            return convertType(input.type);
        })
        .join(' -> ')} -> ${convertOutputTypes(testTemplate.parameters.output)}`;

    let functionBody = `solution ${testTemplate.parameters.input
        .map((input, index) => {
            return `input${index}`;
        })
        .join(' ')} = ${convertOutputValues(testTemplate.parameters.output)}`;

    return `${module}\n${functionSignature}\n${functionBody}`;
}

function createPythonBoilerplate(testTemplate: { 
    parameters: {
        input: { type: string; value: string }[];
        output: { type: string; value: string }[];
    };
}) {
    let functionSignature = `def solution(${testTemplate.parameters.input
        .map((input, index) => {
            return `input${index}: ${convertPythonType(input.type)}`;
        })
        .join(', ')}):`;

    let functionBody = `    return ${convertPythonOutputValues(testTemplate.parameters.output)}`;

    return `${functionSignature}\n${functionBody}`;
}

function convertType(type: string): string {
    switch (type) {
        case 'int':
            return 'Int';
        case 'string':
            return 'String';
        case 'char':
            return 'Char';
        case 'float':
            return 'Double';
        case 'bool':
            return 'Bool';
        default:
            return type;
    }
}

function convertPythonType(type: string): string {
    switch (type) {
        case 'int':
            return 'int';
        case 'string':
            return 'str';
        case 'char':
            return 'str';
        case 'float':
            return 'float';
        case 'bool':
            return 'bool';
        default:
            return 'Any';
    }
}

function convertOutputTypes(outputs: { type: string; value: string }[]): string {
    if (outputs.length === 1) {
        return convertType(outputs[0].type);
    }
    return `(${outputs.map((output) => convertType(output.type)).join(', ')})`;
}

function convertOutputValues(outputs: { type: string; value: string }[]): string {
    if (outputs.length === 1) {
        return `output0`;
    }
    return `(${outputs.map((output, index) => `output${index}`).join(', ')})`;
}

function convertPythonOutputValues(outputs: { type: string; value: string }[]): string {
    if (outputs.length === 1) {
        return `output0`;
    }
    return `(${outputs.map((output, index) => `output${index}`).join(', ')})`;
}