import { describe, it, expect } from 'vitest';
import { setIDEBoilerPlate } from '../../../src/lib/boilerplate';

describe('setIDEBoilerPlate', () => {
    it('should generate Haskell boilerplate for a single input and output', () => {
        const testTemplate = {
            parameters: {
                input: [{ type: 'int', value: '' }],
                output: [{ type: 'int', value: '' }]
            }
        };
        const result = setIDEBoilerPlate(testTemplate, 'haskell');
        expect(result).toBe('solution :: Int -> Int\nsolution input0 = output0');
    });

    it('should generate Haskell boilerplate for multiple inputs and a single output', () => {
        const testTemplate = {
            parameters: {
                input: [
                    { type: 'int', value: '' },
                    { type: 'string', value: '' }
                ],
                output: [{ type: 'bool', value: '' }]
            }
        };
        const result = setIDEBoilerPlate(testTemplate, 'haskell');
        expect(result).toBe('solution :: Int -> String -> Bool\nsolution input0 input1 = output0');
    });

    it('should generate Haskell boilerplate for multiple inputs and multiple outputs', () => {
        const testTemplate = {
            parameters: {
                input: [
                    { type: 'int', value: '' },
                    { type: 'string', value: '' }
                ],
                output: [
                    { type: 'bool', value: '' },
                    { type: 'char', value: '' }
                ]
            }
        };
        const result = setIDEBoilerPlate(testTemplate, 'haskell');
        expect(result).toBe(
            'solution :: Int -> String -> (Bool, Char)\nsolution input0 input1 = (output0, output1)'
        );
    }); 
});