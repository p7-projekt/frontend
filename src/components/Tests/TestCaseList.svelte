<script lang="ts">
    import { testCasesStore } from '$lib/testCasesStore';
    import { Button } from "$lib/components/ui/button/index.js"; // Import a button component for the edit button
    import TestCase from './TestCase.svelte'; // Import the TestCase component

    let testCases: any[] = [];
    let selectedTestCase: any = null; // To hold the test case selected for editing
    let isEditMode = false; // To track if we're in edit mode
    
    // Subscribe to the store to get test cases
    testCasesStore.subscribe(store => {
        testCases = store.testCases;
    });

    // Function to handle the edit button click
    function editTestCase(testCase: any) {
        selectedTestCase = testCase;
        isEditMode = true;
    }

    function finishCreatingOrUpdating() {
        selectedTestCase = null;
        isEditMode = false;
    }

    // Function to cancel the editing process
    function cancelEdit() {
        selectedTestCase = null;
        isEditMode = false;
    }
</script>

{#if isEditMode}
    <!-- Render the TestCase component in edit mode if editing is active -->
    <TestCase 
        isEditMode={true}
        existingTestCase={selectedTestCase}
        on:cancelEdit={cancelEdit} 
        on:finishCreatingOrUpdating={finishCreatingOrUpdating}
    />
{:else}
    <div class="space-y-2 w-full">
        <h3 class="font-semibold text-sm">Created Test Cases</h3>
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
                        <div>
                            <!-- Edit button -->
                            <Button 
                                on:click={() => editTestCase(testCase)} 
                                class="text-xs bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 rounded-md"
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}
