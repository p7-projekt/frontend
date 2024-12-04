<script lang="ts">
	import type { PageData } from './$types';
	import Ide from '$components/IDE/IDE.svelte';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	export { formSchema as form };
	import * as Form from '$lib/components/ui/form/index.js';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import LanguageSelection from '$components/IDE/LanguageSelection.svelte';
	import { debugExercise } from '$lib/debug';
	import { setIDEBoilerPlate } from '$lib/boilerplate';
	import type { ActionData } from '../$types';
	import TestResultsStudent from '$components/Tests/TestResultsStudent.svelte';

	export let data: PageData;
	export let actionData: ActionData;
	export let superFormData: SuperValidated<Infer<FormSchema>> = data.form;
	export let exerciseData = data.exerciseData;
	let languages = data.languages;
	let previousSelectedLanguage: { languageId: number; language: string };
	let selectedLanguage: { languageId: number; language: string };
	let enableIDE: boolean = false;

	$: {
		if (selectedLanguage !== previousSelectedLanguage) {
			previousSelectedLanguage = selectedLanguage;
			$formData.selectedLanguage = selectedLanguage;
			$formData.codeText = setIDEBoilerPlate(data.testTemplate, selectedLanguage.language);
			enableIDE = true;
		}
	}

	const form = superForm(superFormData, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, errors, submitting } = form;
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
			<form
				method="POST"
				use:enhance
				class="max-w max-h"
				action={`?/${data.user?.role != 'Student' ? 'postAnon' : 'postStudent'}&exerciseid=${data.exerciseId}&seshid=${data.sessionId}` + (data.isClassroom ? '&classroom=true' : '')}
			>
				<div class="flex flex-col h-full items-center justify-center p-6 space-y-4 content">
					<div class="ide-container w-full h-full">
						<Ide
							editable={enableIDE}
							bind:solutionLanguage={selectedLanguage}
							bind:codeSolutionText={$formData.codeText}
						/>
						{#if selectedLanguage === undefined}<span class="invalid"
							>Select a language to begin coding!</span
						>{/if}
					</div>
					{#if $errors.test}
						<TestResultsStudent testResults={$errors.test} />
					{/if}
					{#if $errors.codeText}<span class="invalid">{$errors.codeText}</span>{/if}
					{#if $errors._errors}<span class="invalid">{$errors._errors}</span>{/if}

					<div class="flex justify-between w-full items-center mx-8">
						<div class="mx-8">
							<LanguageSelection bind:selected={selectedLanguage} {languages} />
						</div>
						<div class="mx-8">
							{#if $submitting}
								<Button disabled>
									<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
									Please wait
								</Button>
							{:else}
								<Form.Button>Confirm</Form.Button>
							{/if}
						</div>
					</div>
					{#if $errors.selectedLanguage && Object.keys($errors.selectedLanguage).length > 0 && JSON.stringify($errors.selectedLanguage) !== '{}'}
						<span class="invalid">Select a language before proceeding!</span>
					{/if}
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
		height: 90vh;
		display: flex;
		flex-direction: column;
	}
	form {
		height: 90vh;
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
