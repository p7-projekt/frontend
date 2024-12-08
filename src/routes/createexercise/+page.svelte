<script lang="ts">
	import Ide from '$components/IDE/IDE.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import TestCaseList from '$components/Tests/TestCaseList.svelte';
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import type { PageData } from './$types';
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { formSchema, type FormSchema } from './schema';
	import TestCaseTemplate from '$components/Tests/TestCaseTemplate.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { setIDEBoilerPlate } from '../../lib/boilerplate';
	import { onMount } from 'svelte';
	import LanguageSelection from '$components/IDE/LanguageSelection.svelte';
	import TestResults from '$components/Tests/TestResults.svelte';

	export { formSchema as form };

	export let data: PageData;

	let open: boolean = false;
	let isEditMode: boolean = false;
	let exerciseId: number;
	let overwriteCodeText: boolean = false;
	let selectedLanguage: { languageId: number; language: string } = { languageId: 0, language: '' };
	let languages = data.data.languages;

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		isEditMode = urlParams.get('edit') === 'true';
		const exerciseIdParam = urlParams.get('exerciseid');
		if (exerciseIdParam) {
			exerciseId = parseInt(exerciseIdParam, 10);
		} else {
			data.testCasesStore.set({ idCounter: 0, testCases: [] });
		}
	});

	function handleCancel() {
		open = false;
	}

	function handleFinish() {
		open = false;
		overwriteCodeText = true; // Set the flag to overwrite codeText when creating a new test case schema
	}

	export let superFormData: SuperValidated<Infer<FormSchema>> = data.data.form;

	const form = superForm(superFormData, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, submitting, errors } = form;

	export let testCaseSchema: {
		parameters: {
			input: { type: string; value: string }[];
			output: { type: string; value: string }[];
		};
	} = data.testCaseSchema;

	data.testCasesStore.subscribe((store) => {
		$formData.testCases = store.testCases;
	});

	$: if (
		testCaseSchema.parameters.input.length > 0 ||
		testCaseSchema.parameters.output.length > 0
	) {
		createBoilerplate();
	}

	$: {
		if (selectedLanguage) {
			$formData.selectedLanguage = selectedLanguage;
			$formData.codeText = setIDEBoilerPlate(testCaseSchema, selectedLanguage.language);
		}
	}

	function createBoilerplate() {
		if ((!$formData.codeText || overwriteCodeText) && selectedLanguage != null) {
			$formData.codeText = setIDEBoilerPlate(testCaseSchema);
			overwriteCodeText = false; // Reset the flag after overwriting codeText
		}
	}
</script>

<main>
	<form method="POST" use:enhance class="w-full h-full">
		<Resizable.PaneGroup direction="horizontal" class="pane-group max-w max-h rounded-lg border">
			<Resizable.Pane defaultSize={50} class="pane">
				<Resizable.PaneGroup direction="vertical">
					<Resizable.Pane defaultSize={60}>
						<div class="m-8 p-2 content">
							<Form.Field {form} name="title">
								<Form.Control let:attrs>
									<TitleInput
										placeholder="Write your exercise title here"
										{...attrs}
										bind:value={$formData.title}
									/>
								</Form.Control>
								{#if $errors.title}<span class="invalid">{$errors.title}</span>{/if}
							</Form.Field>
							<div class="h-full">
								<Form.Field {form} name="description">
									<Form.Control let:attrs>
										<DescriptionBox
											placeholder="Write your exercise description here"
											customClass="h-[16rem]"
											{...attrs}
											bind:value={$formData.description}
										/>
									</Form.Control>
								</Form.Field>
							</div>
							{#if $errors.description}<span class="invalid">{$errors.description}</span>{/if}
						</div>
					</Resizable.Pane>
					<Resizable.Handle />
					<Resizable.Pane defaultSize={40} style="overflow:auto">
						<div class="m-8 content font-medium">
							<p>Test Case Schema</p>

							<div
								class="flex items-center justify-between p-2 border border-gray-300 rounded-lg shadow-sm bg-[#fff] mb-4"
							>
								<div class="flex items-center space-x-4 text-sm">
									<div>
										<strong class="font-medium">Input:</strong>
										{#each testCaseSchema.parameters.input as input, index (index)}
											<span class="ml-1 text-gray-700"
												><strong>{input.type}</strong
												>{#if index < testCaseSchema.parameters.input.length - 1},
												{/if}</span
											>
										{/each}
									</div>
									<div>
										<strong class="font-medium">Output:</strong>
										{#each testCaseSchema.parameters.output as output, index (index)}
											<span class="ml-1 text-gray-700"
												><strong>{output.type}</strong
												>{#if index < testCaseSchema.parameters.output.length - 1},
												{/if}</span
											>
										{/each}
									</div>
									<Button
										class="secondary"
										on:click={() => {
											open = true;
										}}
									>
										Define/Update Test Case Schema
									</Button>
								</div>
							</div>

							<Dialog.Root bind:open>
								<Dialog.Content class="sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title
											>{testCaseSchema != null
												? 'Edit Test Case Template'
												: 'Create Test Case Template'}</Dialog.Title
										>
									</Dialog.Header>
									<TestCaseTemplate
										bind:testCaseTemplate={testCaseSchema}
										testCasesStore={data.testCasesStore}
										on:cancel={handleCancel}
										on:finishCreatingOrUpdatingTestTemplate={handleFinish}
									/>
								</Dialog.Content>
							</Dialog.Root>

							<TestCaseList
								testCasesStore={data.testCasesStore}
								bind:testCaseTemplate={testCaseSchema}
							/>
							{#if $errors.testCases && $errors.testCases._errors}<span class="invalid"
									>{$errors.testCases._errors}</span
								>{/if}
						</div>
					</Resizable.Pane>
				</Resizable.PaneGroup>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={50} class="pane">
				<div class="flex flex-col h-full items-center justify-center p-6 space-y-4 content">
					<div class="ide-container w-full h-full">
						<Ide
							bind:codeSolutionText={$formData.codeText}
							bind:solutionLanguage={$formData.selectedLanguage}
							editable={!(
								(testCaseSchema.parameters.input.length === 0 &&
									testCaseSchema.parameters.output.length === 0) ||
								selectedLanguage.language == ''
							)}
						/>
					</div>
					<div style="max-height: 30%; overflow-y: auto;">
						{#if testCaseSchema.parameters.input.length === 0 && testCaseSchema.parameters.output.length === 0}<span
								class="invalid"
								>Set a Test Case Schema before you can start creating your solution</span
							>{/if}
						{#if $errors.codeText}<span class="invalid">{$errors.codeText}</span>{/if}
						{#if $errors._errors}<span class="invalid">{$errors._errors}</span>{/if}
					</div>
					{#if $errors.test}
						<TestResults testResults={$errors.test} />
					{/if}
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
					{#if selectedLanguage.language == ''}<span class="invalid"
							>Select a language to begin coding your solution</span
						>{/if}
					{#if $errors.selectedLanguage && Object.keys($errors.selectedLanguage).length > 0 && JSON.stringify($errors.selectedLanguage) !== '{}'}
						<span class="invalid">Select a language before proceeding!</span>
					{/if}
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</form>
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
