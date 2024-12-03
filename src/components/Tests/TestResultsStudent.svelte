<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let testResults: {
		id: number;
		testResult: string;
		cause?: string;
		details?: any;
	}[];
</script>

<div>
	{#each testResults as test}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<div class="circle {test.testResult === 'pass' ? 'pass' : 'failure'}"></div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Test ID: {test.id}</p>
				<p>Result: {test.testResult}</p>
				{#if test.testResult === 'failure'}
					{#if typeof test.details === "string"}
						<p>details: {test?.details} </p>
					{/if}
					{#if test?.details?.inputParameters !== undefined}
					<p>Cause: {test.cause}</p>
					<ul>
						<li>
							Test Input Parameters: {test?.details?.inputParameters
								.map((param) => `${param.valueType}: ${param.value}`)
								.join(', ')}
						</li>

						<li>Actual Output: {test?.details?.actual}</li>
						<li>Expected Output: {test?.details?.expected}</li>
					</ul>
					{/if}
				{/if}
			</Tooltip.Content>
		</Tooltip.Root>
	{/each}
</div>
<div>
	<p>
		{testResults.filter((test) => test.testResult === 'failure').length} test(s) have failed! Test(s)
		Passed: {testResults.filter((test) => test.testResult === 'pass').length}.
	</p>
</div>

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
</style>
