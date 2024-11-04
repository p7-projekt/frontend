<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js';
    import * as Card from '$lib/components/ui/card/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as Select from '$lib/components/ui/select/index.js';
    import { writable, get } from 'svelte/store';
    import { createEventDispatcher, onMount } from 'svelte';
    import ConfirmationDialog from './UpdateTestTemplateDialog.svelte';
    import CircleAlert from 'lucide-svelte/icons/circle-alert';
    import * as Alert from '$lib/components/ui/alert/index.js';

    export let Inputs: { type: string; value: string; argNumber: number; isInput: boolean }[] = [];
    export let Outputs: { type: string; value: string; argNumber: number; isInput: boolean }[] = [];
    export let testCaseTemplate = null;
    export let testCasesStore;

    let inputParameters = writable(Inputs);
    let outputParameters = writable(Outputs);

    const dispatch = createEventDispatcher();

    let showAlert = writable(false);
    let showConfirmationDialog = writable(false);

    const types = [
        { value: 'string', label: 'String' },
        { value: 'int', label: 'Int' },
        { value: 'char', label: 'Char' },
        { value: 'float', label: 'Float' },
        { value: 'bool', label: 'Bool' }
    ];

    onMount(() => {
        if (testCaseTemplate) {
            inputParameters.set(testCaseTemplate.parameters.input);
            outputParameters.set(testCaseTemplate.parameters.output);
        }
    });

    function cancel() {
        dispatch('cancel');
    }

    function addInput() {
        inputParameters.update((inputs) => [
            ...inputs,
            { type: '', value: '', argNumber: inputs.length, isInput: true }
        ]);
    }

    function addOutput() {
        outputParameters.update((outputs) => [
            ...outputs,
            { type: '', value: '', argNumber: outputs.length, isInput: false }
        ]);
    }

    function removeInput(index: number) {
        inputParameters.update((inputs) => {
            const updated = inputs.filter((_, i) => i !== index);
            return updated.map((input, i) => ({ ...input, argNumber: i }));
        });
    }

    function removeOutput(index: number) {
        outputParameters.update((outputs) => {
            const updated = outputs.filter((_, i) => i !== index);
            return updated.map((output, i) => ({ ...output, argNumber: i }));
        });
    }

    function validateInput(input: { type: string; value: string }) {
        switch (input.type) {
            case '': 
				return false;
            default:
                return true;
        }
    }

    function createOrUpdateTestTemplate() {
        const validInputs = get(inputParameters).every(validateInput);
        const validOutputs = get(outputParameters).every(validateInput);
        const hasInputs = get(inputParameters).length > 0;
        const hasOutputs = get(outputParameters).length > 0;
        const hasType =
            get(inputParameters).every((input) => input.type !== '') &&
            get(outputParameters).every((output) => output.type !== '');

        if (validInputs && validOutputs && hasInputs && hasOutputs && hasType) {
            if (testCaseTemplate) {
                const store = get(testCasesStore);
                if (store.testCases.length > 0) {
                    showConfirmationDialog.set(true);
                } else {
                    handleConfirm();
                }
            } else {
                testCaseTemplate.parameters = { input: get(inputParameters), output: get(outputParameters) };
                dispatch('finishCreatingOrUpdatingTestTemplate');
            }
            showAlert.set(false);
        } else {
            showAlert.set(true);
        }
    }

    function handleConfirm() {
        testCasesStore.update((store) => {
            return {
                idCounter: 0,
                testCases: []
            };
        });
        testCaseTemplate.parameters = { input: $inputParameters, output: $outputParameters };
        dispatch('finishCreatingOrUpdatingTestTemplate');
    }
</script>

<Card.Root class="w-[350px]">
    <Card.Content>
        <form on:submit|preventDefault={createOrUpdateTestTemplate}>
            <div class="grid w-full items-center gap-4">
                <div class="flex flex-col space-y-1.5">
                    <Label>Input Parameters</Label>
                    {#each $inputParameters as input, index}
                        <div class="flex space-x-2 items-center">
                            <Select.Root portal={null}>
                                <Select.Trigger class="w-f">
                                    <Select.Value placeholder={input.type ? input.type : 'Type'} />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Types</Select.Label>
                                        {#each types as type}
                                            <Select.Item on:click={() => (input.type = type.value)} value={type.value}>
                                                {type.label}
                                            </Select.Item>
                                        {/each}
                                    </Select.Group>
                                </Select.Content>
                                <Select.Input name="inputType" />
                            </Select.Root>
                            <Button type="button" on:click={() => removeInput(index)}>Remove</Button>
                        </div>
                    {/each}
                    <Button type="button" on:click={addInput}>Add Input</Button>
                </div>
                <div class="flex flex-col space-y-1.5">
                    <Label>Output Parameters</Label>
                    {#each $outputParameters as output, index}
                        <div class="flex space-x-2 items-center">
                            <Select.Root portal={null}>
                                <Select.Trigger class="w-[120px]">
                                    <Select.Value placeholder={output.type ? output.type : 'Type'} />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Types</Select.Label>
                                        {#each types as type}
                                            <Select.Item on:click={() => (output.type = type.value)} value={type.value}>
                                                {type.label}
                                            </Select.Item>
                                        {/each}
                                    </Select.Group>
                                </Select.Content>
                                <Select.Input name="outputType" />
                            </Select.Root>
                            <Button type="button" on:click={() => removeOutput(index)}>Remove</Button>
                        </div>
                    {/each}
                    <Button type="button" on:click={addOutput}>Add Output</Button>
                </div>
            </div>
        </form>
    </Card.Content>
    <Card.Footer class="flex justify-between">
        <Button variant="outline" on:click={cancel}>Cancel</Button>
        <Button type="button" on:click={createOrUpdateTestTemplate}
            >{testCaseTemplate ? 'Update' : 'Create'}</Button
        >
    </Card.Footer>
</Card.Root>

{#if $showAlert}
    <Alert.Root variant="destructive">
        <CircleAlert class="h-4 w-4" />
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>
            Invalid input: Please ensure all types are valid, each parameter has a type, and at least one
            input and one output are provided.
        </Alert.Description>
        <Button on:click={() => showAlert.set(false)}>X</Button>
    </Alert.Root>
{/if}

{#if $showConfirmationDialog}
    <ConfirmationDialog
        bind:open={$showConfirmationDialog}
        on:confirm={handleConfirm}
        on:cancel={() => showConfirmationDialog.set(false)}
    />
{/if}