<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import { writable } from 'svelte/store';
    import CircleAlert from "lucide-svelte/icons/circle-alert";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import PrimaryButton from "$components/Buttons/PrimaryButton.svelte";
    import { testCasesStore } from '$lib/testCasesStore'; 

    export let Inputs: { type: string; value: string; argNumber: number, isInput: boolean }[] = [];
    export let Outputs: { type: string; value: string; argNumber: number, isInput: boolean }[] = [];

    // Writable stores to hold inputs and outputs
    let testName = writable(""); 
    let inputParameters = writable(Inputs);
    let outputParameters = writable(Outputs);

    // Variable to track if alert should be shown
    let showAlert = writable(false); 

    const types = [
        { value: "String", label: "String" },
        { value: "Integer", label: "Integer" }
    ];

    // Function to add a new input parameter
    function addInput() {
        inputParameters.update(inputs => [
            ...inputs, 
            { type: '', value: '', argNumber: inputs.length, isInput: true } // Add isInput attribute
        ]);
    }

    // Function to add a new output parameter
    function addOutput() {
        outputParameters.update(outputs => [
            ...outputs, 
            { type: '', value: '', argNumber: outputs.length, isInput: false } // Add isInput attribute
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
    function validateIntegerValue(input: any) {
        if (input.type === 'Integer') {
            return /^\d+$/.test(input.value); // Check if the value is a valid integer
        }
        return true;
    }

    // Function to handle the form submission
    function createTestCase() { 
        const validInputs = $inputParameters.every(validateIntegerValue);
        const hasInputs = $inputParameters.length > 0;
        const hasOutputs = $outputParameters.length > 0;

        if (validInputs && hasInputs && hasOutputs) {
            testCasesStore.update(store => {
                const newTestCase = {
                    id: store.idCounter + 1,
                    parameters: {
                        input: $inputParameters,
                        output: $outputParameters
                    }
                };
                return {
                    idCounter: store.idCounter + 1,
                    testCases: [...store.testCases, newTestCase]
                };
            });
            showAlert.set(false);
        } else {
            showAlert.set(true);
        }
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
                                            <Select.Item on:click={() => input.type = type.value} value={type.value}>{type.label}</Select.Item>
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
                                            <Select.Item on:click={() => output.type = type.value} value={type.value}>{type.label}</Select.Item>
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

<!-- Conditionally show alert when input is invalid -->
{#if $showAlert}
<Alert.Root variant="destructive">
    <CircleAlert class="h-4 w-4" />
    <Alert.Title>Error</Alert.Title>
    <Alert.Description>
        Invalid input: Please ensure all integers are valid numbers, and at least one input and one output are provided.
    </Alert.Description>
    <Button on:click={() => {console.log("hello button clicked"); showAlert.set(false);}}>X</Button>
</Alert.Root>
{/if}
