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
            return 'Float';
        case 'bool':
            return 'Bool';
        default:
            return type;
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