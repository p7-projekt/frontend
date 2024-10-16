<script lang="ts">
    import { testCasesStore } from '$lib/testCasesStore';
    import { Button } from "$lib/components/ui/button/index.js"; 
    import * as Dialog from "$lib/components/ui/dialog/index.js"; 
    import TestCase from './TestCase.svelte';  

    let testCases: any[] = []; 
    let isEditMode = false;  
    let openCreate: boolean = false;
    let openEdit: boolean = false;
    let selectedTestCase: any;

    // Subscribe to the store to get test cases
    testCasesStore.subscribe(store => {
        testCases = store.testCases;
    });

    // Function to handle the edit button click
    function editTestCase(testCase: any) { 
        isEditMode = true;
    }

    function finishCreatingOrUpdating() { 
        isEditMode = false;
        openCreate = false; 
        selectedTestCase = null;
    }

    // Function to cancel the editing process
    function cancel() { 
        isEditMode = false;
        selectedTestCase = null;
    }
 
</script>
 
<Dialog.Root bind:open={openEdit}> 
        <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
        <Dialog.Title>Edit Test Case</Dialog.Title> 
        </Dialog.Header> 
        <TestCase 
            isEditMode={true}
            existingTestCase={selectedTestCase}
            on:cancel={cancel} 
            on:finishCreatingOrUpdating={finishCreatingOrUpdating}
        />
    </Dialog.Content>
</Dialog.Root>   


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


                            

 
                            <Button  
                            class="secondary" on:click={()=>{openEdit=true;selectedTestCase = testCase;}}
                        >
                            Edit Test Case
                            </Button>









                        </div>
                    </div>
                {/each}
            </div>
        {/if}
        <!-- Create Test Case Button at the bottom -->
        <div class="mt-4">
            <Dialog.Root bind:open={openCreate}>
                <Dialog.Trigger class="w-full "  
                ><Button  
                class="w-full text-white   py-2 rounded-md"
            >
                Create Test Case
            </Button></Dialog.Trigger
               >
                <Dialog.Content class="sm:max-w-[425px]">
                <Dialog.Header>
                 <Dialog.Title>Create Test Case</Dialog.Title> 
                </Dialog.Header> 
                <TestCase 
                    isEditMode={false} 
                    on:cancel={cancel} 
                    on:finishCreatingOrUpdating={finishCreatingOrUpdating}
                />
        </Dialog.Content>
    </Dialog.Root>
        </div>
    </div> 
