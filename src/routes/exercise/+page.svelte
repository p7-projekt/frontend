<script lang="ts">
	import type { PageData } from './$types';
	import Ide from '$components/IDE/IDE.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	export { formSchema as form };
	import * as Form from '$lib/components/ui/form/index.js';
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';

	export let data: PageData;
	export let superFormData: SuperValidated<Infer<FormSchema>> = data.form;
	export let exerciseData = data.exerciseData;


	const form = superForm(superFormData, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, errors } = form;
 

</script>

<main>
		<Resizable.PaneGroup direction="horizontal" class="pane-group max-w max-h rounded-lg border">
			<Resizable.Pane defaultSize={50} class="pane">
				<Resizable.PaneGroup direction="vertical">
					<Resizable.Pane defaultSize={60}>
						<div class="m-8 content">
							<h1 class=" text-2xl font-semibold col-span-full">{exerciseData.title}</h1>
							<p class="text-muted-foreground text-sm">{exerciseData.description}</p>
						</div>
						
					</Resizable.Pane>
					<Resizable.Handle />
					<Resizable.Pane defaultSize={40}>
						<div class="m-8 content">
							<h1 class=" text-2xl font-semibold col-span-full">Example Test Cases</h1>
							<ul>
								{#each exerciseData.testCases as testCase}
									<li>
										<p>Input: {testCase.inputParams.join(', ')}</p>
										<p>Output: {testCase.outputParams.join(', ')}</p> 
									</li>
								{/each}
							</ul>
						</div>  
					</Resizable.Pane>
				</Resizable.PaneGroup>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={50} class="pane">
				<form method="POST" use:enhance class="max-w max-h">
					<div class="flex flex-col h-full items-center justify-center p-6 space-y-4 content">
						<div class="ide-container w-full h-full">
							<Ide bind:codeSolutionText={$formData.codeText} />
						</div> 
						{#if $errors.codeText}<span class="invalid">{$errors.codeText}</span>{/if}
						{#if $errors._errors}<span class="invalid">{$errors._errors}</span>{/if}

						<div class="flex space-x-4">
							<Button variant="default">Validate</Button>
							<Form.Button>Confirm</Form.Button>
						</div>
					</div>
				</form>
			</Resizable.Pane>
		</Resizable.PaneGroup>
</main>

<style>
	html,
	body {
		height: 100%;
		margin: 0;
	}
	main {
		height: 80vh;
		display: flex;
		flex-direction: column;
	}
	form {
		height: 80vh;
		display: flex;
		flex-direction: column;
	}
	.pane-group {
		flex: 1;
		overflow: hidden;
	}
	.pane {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.content {
		flex: 1;
		overflow: hidden;
	}
	.ide-container {
		flex: 1;
		overflow: auto;
	}

	.invalid {
		color: red;
	}
</style>
