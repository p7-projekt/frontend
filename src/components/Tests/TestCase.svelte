<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js';
    import * as Card from '$lib/components/ui/card/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';
    import * as Select from '$lib/components/ui/select/index.js';
    import { writable } from 'svelte/store';
    import CircleAlert from 'lucide-svelte/icons/circle-alert';
    import * as Alert from '$lib/components/ui/alert/index.js';
    import { createEventDispatcher, onMount } from 'svelte';

    export let testCasesStore: any;
    export let testCaseTemplate: any;

    export let isEditMode: boolean = false;
    export let existingTestCase: { id: number; parameters: { input: any; output: any } } | null = null;

    let inputParameters = writable(testCaseTemplate.parameters.input);
    let outputParameters = writable(testCaseTemplate.parameters.output);
    const dispatch = createEventDispatcher();

    let showAlert = writable(false);

    const types = [
        { value: 'String', label: 'String' },
        { value: 'Integer', label: 'Integer' }
    ];

    function cancel() {
        dispatch('cancel');
    }

    onMount(() => {
        if (isEditMode && existingTestCase) {
            inputParameters.set(existingTestCase.parameters.input);
            outputParameters.set(existingTestCase.parameters.output);
        }
    });

    function validateIntegerValue(input: any) {
        if (input.type === 'Integer') {
            return /^\d+$/.test(input.value);
        }
        return true;
    }

    function submitTestCase() {
        const validInputs =
            $inputParameters.every(validateIntegerValue) && $outputParameters.every(validateIntegerValue);
        const hasInputs = $inputParameters.length > 0;
        const hasOutputs = $outputParameters.length > 0;
        const hasType =
            $inputParameters.every((input: any) => input.type !== '') &&
            $outputParameters.every((output: any) => output.type !== '');

        if (validInputs && hasInputs && hasOutputs && hasType) {
            testCasesStore.update((store: any) => {
                if (isEditMode && existingTestCase) {
                    const updatedTestCases = store.testCases.map((tc: any) =>
                        tc.id === existingTestCase.id
                            ? { ...tc, parameters: { input: $inputParameters, output: $outputParameters } }
                            : tc
                    );
                    return { ...store, testCases: updatedTestCases };
                } else {
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
                }
            });
            showAlert.set(false);
            dispatch('finishCreatingOrUpdating');
        } else {
            showAlert.set(true);
        }
    }
</script>

<Card.Root class="w-[350px]">
    <Card.Content>
        <form on:submit|preventDefault={submitTestCase}>
            <div class="grid w-full items-center gap-4">
                <div class="flex flex-col space-y-1.5">
                    <Label>Input Parameters</Label>
                    {#each $inputParameters as input, index}
                        <div class="flex space-x-2 items-center">
                            <Select.Root portal={null}>
                                <Select.Trigger class="w-[120px]">
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
                            <Input
                                bind:value={input.value}
                                placeholder="Value"
                                class={input.type === 'Integer' && !/^\d+$/.test(input.value)
                                    ? 'border-red-500'
                                    : ''}
                            />
                            {#if input.type === 'Integer' && !/^\d+$/.test(input.value)}
                                <span class="text-red-500">Invalid Integer</span>
                            {/if}
                        </div>
                    {/each}
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
                            <Input
                                bind:value={output.value}
                                placeholder="Value"
                                class={output.type === 'Integer' && !/^\d+$/.test(output.value)
                                    ? 'border-red-500'
                                    : ''}
                            />
                            {#if output.type === 'Integer' && !/^\d+$/.test(output.value)}
                                <span class="text-red-500">Invalid Integer</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
        </form>
    </Card.Content>
    <Card.Footer class="flex justify-between">
        <Button variant="outline" on:click={cancel}>Cancel</Button>
        <Button type="submit" on:click={submitTestCase}>{isEditMode ? 'Update' : 'Create'}</Button>
    </Card.Footer>
</Card.Root>

{#if $showAlert}
    <Alert.Root variant="destructive">
        <CircleAlert class="h-4 w-4" />
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>
            Invalid input: Please ensure all integers are valid numbers, each parameter has a type, and at
            least one input and one output are provided.
        </Alert.Description>
        <Button on:click={() => showAlert.set(false)}>X</Button>
    </Alert.Root>
{/if}