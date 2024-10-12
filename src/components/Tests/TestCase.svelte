<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { writable } from 'svelte/store';

    export let TCNumber: number;
    export let Inputs: { type: string; value: string; argNumber: number }[] = [];
    export let Outputs: { type: string; value: string; argNumber: number }[] = [];

    // Writable stores to hold inputs and outputs
    let testName = writable(""); 
    let inputParameters = writable(Inputs);
    let outputParameters = writable(Outputs);

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

    // Function to handle the form submission
    function createTestCase() {
        const testCase = {
            id: TCNumber, 
            parameters: {
                input: $inputParameters,
                output: $outputParameters
            }
        };
        console.log("Test Case Created: ", testCase);
        // You can add logic here to save or send this data as needed
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
                            <Input bind:value={input.type} placeholder="Type" />
                            <Input bind:value={input.value} placeholder="Value" />
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
                            <Input bind:value={output.type} placeholder="Type" />
                            <Input bind:value={output.value} placeholder="Value" />
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
