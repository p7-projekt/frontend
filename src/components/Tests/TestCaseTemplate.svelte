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

	export let Inputs: { type: string; value: string; argNumber: number; isInput: boolean }[] = [];
	export let Outputs: { type: string; value: string; argNumber: number; isInput: boolean }[] = []; 
	export let testCaseTemplate: any | null = null;

	let inputParameters = writable(Inputs);
	let outputParameters = writable(Outputs);

	const dispatch = createEventDispatcher();

	let showAlert = writable(false);

	const types = [
		{ value: 'String', label: 'String' },
		{ value: 'Integer', label: 'Integer' }
	];

	onMount(() => {
		if (testCaseTemplate) {
			inputParameters.set(testCaseTemplate.parameters.input);
			outputParameters.set(testCaseTemplate.parameters.output);
		}
	});

	function cancel() {
		dispatch('cancel');
	}

	function addInput() {
		inputParameters.update((inputs) => [
			...inputs,
			{ type: '', value: '', argNumber: inputs.length, isInput: true }
		]);
	}

	function addOutput() {
		outputParameters.update((outputs) => [
			...outputs,
			{ type: '', value: '', argNumber: outputs.length, isInput: false }
		]);
	}

	function removeInput(index: number) {
		inputParameters.update((inputs) => {
			const updated = inputs.filter((_, i) => i !== index);
			return updated.map((input, i) => ({ ...input, argNumber: i }));
		});
	}

	function removeOutput(index: number) {
		outputParameters.update((outputs) => {
			const updated = outputs.filter((_, i) => i !== index);
			return updated.map((output, i) => ({ ...output, argNumber: i }));
		});
	}

	function createOrUpdateTestTemplate() {
		testCaseTemplate.parameters = { input: $inputParameters, output: $outputParameters };
		dispatch('finishCreatingOrUpdatingTestTemplate');
	}
</script>

<Card.Root class="w-[350px]">
	<Card.Content>
		<form on:submit|preventDefault={createOrUpdateTestTemplate}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label>Input Parameters</Label>
					{#each $inputParameters as input, index}
						<div class="flex space-x-2 items-center">
							<Select.Root portal={null}>
								<Select.Trigger class="w-f">
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
							<Button type="button" on:click={() => removeInput(index)}>Remove</Button>
						</div>
					{/each}
					<Button type="button" on:click={addInput}>Add Input</Button>
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
							<Button type="button" on:click={() => removeOutput(index)}>Remove</Button>
						</div>
					{/each}
					<Button type="button" on:click={addOutput}>Add Output</Button>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline" on:click={cancel}>Cancel</Button>
		<Button type="button" on:click={createOrUpdateTestTemplate}
			>{testCaseTemplate ? 'Update' : 'Create'}</Button
		>
	</Card.Footer>
</Card.Root>
