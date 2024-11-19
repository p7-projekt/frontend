<script lang="ts">


    export let testResults: { id: number, testResult: string, cause?: string, details?: { inputParameters: any[], actual: any, expected: any } }[];

</script>

{#each testResults as error}
    <div class="invalid">
        <p>Test ID: {error.id}</p>
        <p>Result: {error.testResult}</p>
        {#if error.testResult === 'failure'}
            <p>Cause: {error.cause}</p>
            <p>Details:</p>
            <ul>
                <li>Input Parameters: {error.details.inputParameters.join(', ')}</li>
                <li>Actual: {error.details.actual}</li>
                <li>Expected: {error.details.expected}</li>
            </ul>
        {/if}
    </div>
{/each}