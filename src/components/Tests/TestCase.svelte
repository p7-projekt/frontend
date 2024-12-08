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
	import { types } from './testcasetypes';

	export let testCasesStore;
	export let testCaseTemplate;

	export let isEditMode: boolean = false;
	export let existingTestCase: { id: number; parameters: { input; output } } | null = null;

	let inputParameters = writable(JSON.parse(JSON.stringify(testCaseTemplate.parameters.input)));
	let outputParameters = writable(JSON.parse(JSON.stringify(testCaseTemplate.parameters.output)));

	const dispatch = createEventDispatcher();

	let showAlert = writable(false);

	function cancel() {
		dispatch('cancel');
	}

	onMount(() => {
		if (isEditMode && existingTestCase) {
			inputParameters.set(existingTestCase.parameters.input);
			outputParameters.set(existingTestCase.parameters.output);
		}
	});

	function validateIntegerValue(input) {
		return /^-?\d+$/.test(input.value);
	}

	function validateStringValue(input) {
		return typeof input.value === 'string';
	}

	function validateCharValue(input) {
		return typeof input.value === 'string' && input.value.length === 1;
	}

	function validateFloatValue(input) {
		return /^-?\d+(\.\d+)?$/.test(input.value);
	}

	function validateBoolValue(input) {
		return input.value === 'true' || input.value === 'false';
	}

	function validateInput(input) {
		switch (input.type) {
			case 'int':
				return validateIntegerValue(input);
			case 'string':
				return validateStringValue(input);
			case 'char':
				return validateCharValue(input);
			case 'float':
				return validateFloatValue(input);
			case 'bool':
				return validateBoolValue(input);
			default:
				return true;
		}
	}

	function submitTestCase() {
		const validInputs =
			$inputParameters.every(validateInput) && $outputParameters.every(validateInput);
		const hasInputs = $inputParameters.length > 0;
		const hasOutputs = $outputParameters.length > 0;
		const hasType =
			$inputParameters.every((input) => input.type !== '') &&
			$outputParameters.every((output) => output.type !== '');

		if (validInputs && hasInputs && hasOutputs && hasType) {
			testCasesStore.update((store) => {
				if (isEditMode && existingTestCase) {
					const updatedTestCases = store.testCases.map((tc) =>
						tc.id === existingTestCase.id
							? {
									...tc,
									parameters: {
										input: JSON.parse(JSON.stringify($inputParameters)),
										output: JSON.parse(JSON.stringify($outputParameters))
									}
								}
							: tc
					);
					return { ...store, testCases: updatedTestCases };
				} else {
					const newTestCase = {
						id: store.idCounter + 1,
						parameters: {
							input: JSON.parse(JSON.stringify($inputParameters)),
							output: JSON.parse(JSON.stringify($outputParameters))
						},
						publicVisible: false
					};
					return {
						idCounter: store.idCounter + 1,
						testCases: [...store.testCases, newTestCase]
					};
				}
			});
			showAlert.set(false);
			dispatch('finishCreatingOrUpdating');
		} else {
			showAlert.set(true);
		}
	}
</script>

<Card.Root class="w-[350px]">
	<Card.Content>
		<form on:submit|preventDefault={submitTestCase}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label>Input Parameters</Label>
					{#each $inputParameters as input, index}
						<div class="flex space-x-2 items-center" key={index}>
							<Select.Root portal={null}>
								<Select.Trigger class="w-[120px]" disabled={true}>
									<Select.Value placeholder={input.type ? input.type : 'Type'} />
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Types</Select.Label>
										{#each types as type}
											<Select.Item
												on:click={() => {
													if (!isEditMode) input.type = type.value;
												}}
												value={type.value}
												disabled={true}
											>
												{type.label}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
								<Select.Input name="inputType" />
							</Select.Root>
							<Input
								bind:value={input.value}
								placeholder="Value"
								class={validateInput(input) ? '' : 'border-red-500'}
							/>
							{#if !validateInput(input)}
								<span class="text-red-500">Invalid {input.type}</span>
							{/if}
						</div>
					{/each}
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label>Output Parameters</Label>
					{#each $outputParameters as output, index}
						<div class="flex space-x-2 items-center" key={index}>
							<Select.Root portal={null}>
								<Select.Trigger class="w-[120px]" disabled={true}>
									<Select.Value placeholder={output.type ? output.type : 'Type'} />
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Types</Select.Label>
										{#each types as type}
											<Select.Item
												on:click={() => {
													if (!isEditMode) output.type = type.value;
												}}
												value={type.value}
												disabled={true}
											>
												{type.label}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
								<Select.Input name="outputType" />
							</Select.Root>
							<Input
								bind:value={output.value}
								placeholder="Value"
								class={validateInput(output) ? '' : 'border-red-500'}
							/>
							{#if !validateInput(output)}
								<span class="text-red-500">Invalid {output.type}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline" on:click={cancel}>Cancel</Button>
		<Button type="submit" on:click={submitTestCase}>{isEditMode ? 'Update' : 'Create'}</Button>
	</Card.Footer>
</Card.Root>

{#if $showAlert}
	<Alert.Root variant="destructive">
		<CircleAlert class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>
			Invalid input: Please ensure all types are valid, each parameter has a type, and at least one
			input and one output are provided.
		</Alert.Description>
		<Button on:click={() => showAlert.set(false)}>X</Button>
	</Alert.Root>
{/if}
