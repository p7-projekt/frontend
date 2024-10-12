<script lang="ts">
    import { testCasesStore } from '$lib/testCasesStore';
    import * as Card from "$lib/components/ui/card/index.js";

    let testCases: any[] = [];
    
    testCasesStore.subscribe(store => {
        testCases = store.testCases;
    });
</script>

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
                    </li>
                {/each}
            </ul>
        {/if}
    </Card.Content>
</Card.Root>