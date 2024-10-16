<script lang="ts">
    import { testCasesStore } from '$lib/testCasesStore';
    import * as Card from "$lib/components/ui/card/index.js";
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
    <Card.Root class="w-full">
        <Card.Header>
            <Card.Title>Created Test Cases</Card.Title>
            <Card.Description>View the created test cases below.</Card.Description>
        </Card.Header>
        <Card.Content>
            {#if testCases.length === 0}
                <p>No test cases created yet.</p>
            {:else}
                <ul class="space-y-4">
                    {#each testCases as testCase}
                        <li>
                            <h4>Test Case ID: {testCase.id}</h4>
                            <h5>Input Parameters:</h5>
                            <ul>
                                {#each testCase.parameters.input as input}
                                    <li>{input.type}: {input.value}</li>
                                {/each}
                            </ul>
                            <h5>Output Parameters:</h5>
                            <ul>
                                {#each testCase.parameters.output as output}
                                    <li>{output.type}: {output.value}</li>
                                {/each}
                            </ul>
                            <!-- Add the Edit button here -->
                            <button on:click={() => editTestCase(testCase)}>
                                Edit
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </Card.Content>
    </Card.Root>
{/if}
