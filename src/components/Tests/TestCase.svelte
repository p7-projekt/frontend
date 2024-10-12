<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { writable } from 'svelte/store';

    export let TCNumber: number;
    export let Inputs: { type: string; value: string; argNumber: number }[] = [];
    export let Outputs: { type: string; value: string; argNumber: number }[] = [];

    // Writable stores to hold inputs and outputs
    let testName = writable(""); 
    let inputParameters = writable(Inputs);
    let outputParameters = writable(Outputs);

    const types = [
        { value: "String", label: "String" },
        { value: "Integer", label: "Integer" }
    ];

    // Function to add a new input parameter
    function addInput() {
        inputParameters.update(inputs => [
            ...inputs, 
            { type: '', value: '', argNumber: inputs.length } // Set argNumber to current length (index)
        ]);
    }

    // Function to add a new output parameter
    function addOutput() {
        outputParameters.update(outputs => [
            ...outputs, 
            { type: '', value: '', argNumber: outputs.length } // Set argNumber to current length (index)
        ]);
    }

    // Function to remove an input parameter
    function removeInput(index: number) {
        inputParameters.update(inputs => {
            const updated = inputs.filter((_, i) => i !== index);
            return updated.map((input, i) => ({ ...input, argNumber: i })); // Recalculate argNumber after removal
        });
    }

    // Function to remove an output parameter
    function removeOutput(index: number) {
        outputParameters.update(outputs => {
            const updated = outputs.filter((_, i) => i !== index);
            return updated.map((output, i) => ({ ...output, argNumber: i })); // Recalculate argNumber after removal
        });
    }

    // Validation function for checking integer type
    function validateValue(input: any) {
        if (input.type === 'Integer') {
            return /^\d+$/.test(input.value); // Check if the value is a valid integer
        }
        return true;
    }

    // Function to handle the form submission
    function createTestCase() {
        console.log("Test Case Created: ", $inputParameters, $outputParameters);
        
        // const validInputs = $inputParameters.every(validateValue);
        
        // if (validInputs) {
        //     const testCase = {
        //         id: TCNumber, 
        //         parameters: {
        //             input: $inputParameters,
        //             output: $outputParameters
        //         }
        //     };
        //     console.log("Test Case Created: ", testCase);
        //     // You can add logic here to save or send this data as needed
        // } else {
        //     console.error("Invalid input: Please ensure all integers are valid numbers.");
        // }
    }
</script>

<Card.Root class="w-[350px]">
    <Card.Header>
        <Card.Title>Create Test Case</Card.Title>
        <Card.Description>Select inputs, types, and outputs.</Card.Description>
    </Card.Header>
    <Card.Content>
        <form on:submit|preventDefault={createTestCase}>
            <div class="grid w-full items-center gap-4">
                <!-- Input Parameters -->
                <div class="flex flex-col space-y-1.5">
                    <Label>Input Parameters</Label>
                    {#each $inputParameters as input, index}
                        <div class="flex space-x-2 items-center">
                            <!-- Type Select -->
                            <Select.Root portal={null}>
                                <Select.Trigger class="w-[120px]">
                                    <Select.Value placeholder="Type" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Types</Select.Label>
                                        {#each types as type}
                                            <Select.Item on:click={() =>input.type = type.value} value={type.value}>{type.label}</Select.Item>
                                        {/each}
                                    </Select.Group>
                                </Select.Content>
                                <Select.Input name="inputType" />
                            </Select.Root>

                            <!-- Value Input -->
                            <Input bind:value={input.value} placeholder="Value" class={input.type === 'Integer' && !/^\d+$/.test(input.value) ? 'border-red-500' : ''} />
                            {#if input.type === 'Integer' && !/^\d+$/.test(input.value)}
                                <span class="text-red-500">Invalid Integer</span>
                            {/if}

                            <!-- Remove Button -->
                            <Button type="button" on:click={() => removeInput(index)}>Remove</Button>
                        </div>
                    {/each}
                    <Button type="button" on:click={addInput}>Add Input</Button>
                </div>

                <!-- Output Parameters -->
                <div class="flex flex-col space-y-1.5">
                    <Label>Output Parameters</Label>
                    {#each $outputParameters as output, index}
                        <div class="flex space-x-2 items-center">
                            <!-- Type Select -->
                            <Select.Root portal={null}>
                                <Select.Trigger class="w-[120px]">
                                    <Select.Value placeholder="Type" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Types</Select.Label>
                                        {#each types as type}
                                            <Select.Item value={type.value}>{type.label}</Select.Item>
                                        {/each}
                                    </Select.Group>
                                </Select.Content>
                                <Select.Input name="outputType" />
                            </Select.Root>

                            <!-- Value Input -->
                            <Input bind:value={output.value} placeholder="Value" class={output.type === 'Integer' && !/^\d+$/.test(output.value) ? 'border-red-500' : ''} />
                            {#if output.type === 'Integer' && !/^\d+$/.test(output.value)}
                                <span class="text-red-500">Invalid Integer</span>
                            {/if}

                            <!-- Remove Button -->
                            <Button type="button" on:click={() => removeOutput(index)}>Remove</Button>
                        </div>
                    {/each}
                    <Button type="button" on:click={addOutput}>Add Output</Button>
                </div>
            </div>
        </form>
    </Card.Content>
    <Card.Footer class="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" on:click={createTestCase}>Create</Button>
    </Card.Footer>
</Card.Root>

<Button on:click={createTestCase}>Create</Button>
