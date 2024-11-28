<script lang="ts">
import * as Tooltip from "$lib/components/ui/tooltip";

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
    <Tooltip.Root>
        <Tooltip.Trigger><div
            class="circle {test.testResult === 'pass' ? 'pass' : 'failure'}" 
        ></div></Tooltip.Trigger>
        <Tooltip.Content>
            <p>Test ID: {test.id}</p>
            <p>Result: {test.testResult}</p>
            {#if test.testResult === 'failure'}
                <p>Cause: {test.cause}</p> 
                <ul>
                    <li>Test Input Parameters: {test.details.inputParameters.map(param => `${param.valueType}: ${param.value}`).join(', ')}</li>
                    <li>Actual Output: {test.details.actual}</li>
                    <li>Expected Output: {test.details.expected}</li>
                </ul>
            {/if}
        </Tooltip.Content>
      </Tooltip.Root>    
    
    
    {/each}
</div>
<div> 
    <p>{testResults.filter(test => test.testResult === 'failure').length} test(s) have failed! Test(s) Passed: {testResults.filter(test => test.testResult === 'pass').length}.</p>
</div>
 