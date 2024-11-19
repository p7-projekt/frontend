<script lang="ts">
    export let testResults: { id: number, testResult: string, cause?: string, details?: { inputParameters: any[], actual: any, expected: any } }[];

    let selectedTest = null;

    function handleCircleClick(test) {
        selectedTest = test;
    }
</script>

<style>
    .circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        margin: 5px;
        cursor: pointer;
    }
    .pass {
        background-color: green;
    }
    .failure {
        background-color: red;
    }
    .tooltip {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
</style>

<div>
    {#each testResults as test}
        <div
            class="circle {test.testResult === 'pass' ? 'pass' : 'failure'}"
            on:click={() => handleCircleClick(test)}
            on:mouseover={() => handleCircleClick(test)}
            on:mouseleave={() => selectedTest = null}
        ></div>
    {/each}
</div>

{#if selectedTest}
    <div class="tooltip">
        <p>Test ID: {selectedTest.id}</p>
        <p>Result: {selectedTest.testResult}</p>
        {#if selectedTest.testResult === 'failure'}
            <p>Cause: {selectedTest.cause}</p>
            <p>Details:</p>
            <ul>
                <li>Input Parameters: {selectedTest.details.inputParameters.map(param => `${param.valueType}: ${param.value}`).join(', ')}</li>
                <li>Actual: {selectedTest.details.actual}</li>
                <li>Expected: {selectedTest.details.expected}</li>
            </ul>
        {/if}
    </div>
{/if}