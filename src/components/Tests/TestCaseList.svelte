<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js';
    import TestCaseDialog from './TestCaseDialog.svelte';
    import { Label } from '$lib/components/ui/label/index.js';

    export let testCasesStore: any;
    export let testCaseTemplate: any;

    let testCases: any[] = [];
    let openCreate: boolean = false;
    let openEdit: boolean = false;
    let selectedTestCase: any;

    testCasesStore.subscribe((store: any) => {
        testCases = store.testCases;
    });

    function finishCreatingOrUpdating() {
        openCreate = false;
        openEdit = false;
        selectedTestCase = null;
    }

    function cancel() {
        openCreate = false;
        openEdit = false;
        selectedTestCase = null;
    }

    function removeTestCase(testCaseId: number) {
        testCasesStore.update((store: any) => {
            return {
                ...store,
                testCases: store.testCases.filter((tc: any) => tc.id !== testCaseId)
            };
        });
    }
</script>

<TestCaseDialog
    bind:open={openEdit}
    isEditMode={true}
    existingTestCase={selectedTestCase}
    on:cancel={cancel}
    on:finishCreatingOrUpdating={finishCreatingOrUpdating}
    {testCasesStore}
    {testCaseTemplate}
/>

<div class="space-y-2 w-full">
    <Label class="text-base pl-1">Created Test Cases</Label>
    {#if testCases.length === 0}
        <p class="text-gray-500">No test cases created yet.</p>
    {:else}
        <div class="space-y-2">
            {#each testCases as testCase}
                <div class="flex items-center justify-between p-2 border rounded-lg shadow-sm bg-gray-50">
                    <div class="flex items-center space-x-4 text-sm">
                        <div>
                            <strong class="font-medium">Input:</strong>
                            {#each testCase.parameters.input as input}
                                <span class="ml-1 text-gray-700">{input.type}: {input.value}</span>
                            {/each}
                        </div>
                        <div>
                            <strong class="font-medium">Output:</strong>
                            {#each testCase.parameters.output as output}
                                <span class="ml-1 text-gray-700">{output.type}: {output.value}</span>
                            {/each}
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <Button
                            class="secondary"
                            on:click={() => {
                                openEdit = true;
                                selectedTestCase = testCase;
                            }}
                        >
                            Edit Test Case
                        </Button>
                        <Button variant="destructive" on:click={() => removeTestCase(testCase.id)}>
                            Remove
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    <div class="mt-4">
        <TestCaseDialog
            bind:open={openCreate}
            isEditMode={false}
            on:cancel={cancel}
            on:finishCreatingOrUpdating={finishCreatingOrUpdating}
            {testCasesStore}
            {testCaseTemplate}
        />
        <Button class="w-full text-white py-2 rounded-md bottom-1" on:click={() => (openCreate = true)}>
            Create Test Case
        </Button>
    </div>
</div>