<script lang="ts">
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import ExerciseList from '$components/Lists/ExerciseList.svelte';
	import Select from '$components/Select/Select.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import {
		displayValidationErrors,
		getEditAddedExercises,
		getEditLanguages,
		getEditRemainingExercises
	} from './create_session';

	export let data: PageData;
	export let form: ActionData;

	const classroom_id = data.classroom_id ? data.classroom_id : null;
	const edit_session = data.session ? data.session : null;

	let receive_message;

	// Values for the select expiration time Select component
	let expiration_select_title: string = 'Expires in';
	let expiration_select_options: { value: string; label: string }[] = [
		{ value: '1', label: 'One hour' },
		{ value: '2', label: 'Two hours' },
		{ value: '3', label: 'Three hours' },
		{ value: '4', label: 'Four hours' },
		{ value: '5', label: 'Five hours' },
		{ value: '6', label: 'Six hours' },
		{ value: '7', label: 'Seven hours' },
		{ value: '8', label: 'Eight hours' },
		{ value: '9', label: 'Nine hours' },
		{ value: '10', label: 'Ten hours' }
	];
	let expiration_selected_option: string = '';

	// Values for the programming language Select component
	let lang_select_title: string = 'Choose Language(s)';
	let lang_select_options: { value: number; label: string }[] = data.programming_languages.map(
		(language: { languageId: number; language: string }) => {
			return {
				value: language.languageId,
				label: language.language.charAt(0).toUpperCase() + language.language.slice(1)
			};
		}
	);

	let lang_selected_options: string[];

	// To make the ListBox component as resuable as possible we map Exercise properties to the parameters of the ListComponent
	let added_exercise_list: { id: number; content: string }[] = !edit_session
		? []
		: getEditAddedExercises(edit_session.exerciseIds);
	let remaining_exercise_list =
		edit_session && data.instructor_exercises
			? getEditRemainingExercises(data.instructor_exercises, edit_session.exerciseIds)
			: data.instructor_exercises
				? data.instructor_exercises.map((exercise: { id: number; name: string }) => ({
						id: exercise.id,
						content: exercise.name
					}))
				: [];

	function handleMessage(event) {
		receive_message = event.detail;
		added_exercise_list = receive_message.added_exercise_list;
	}

	function expirationOptionSelected(event) {
		expiration_selected_option = event.detail.chosen_option.value;
	}

	function langOptionSelected(event) {
		const lang_selected = event.detail.chosen_options;
		lang_selected_options = lang_selected.map((lang_selected) => lang_selected.value);
	}

	// Update validation errors given events
	$: error = displayValidationErrors(form);
</script>

<form
	method="post"
	action={!classroom_id
		? '?/oneOffSession'
		: !edit_session
			? '?/classroomSession'
			: '?/updateClassroomSession'}
	use:enhance
>
	<div class="container grid grid-cols-2 gap-6 pl-6 w-full text-[#333] mt-3">
		<div></div>
		<div class="flex justify-end cursor-pointer">
			<a href={!classroom_id ? '/' : `/classroom/${classroom_id}`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</a>
		</div>
		<h1 class=" text-2xl font-medium col-span-full">Create Session</h1>

		<div class="w-1/4 col-span-full">
			<TitleInput input_name="session-title" value={edit_session ? edit_session.title : ''} />
			{#if error.errorInTitle.message}
				<p style="color:red; margin-bottom:0;">{error.errorInTitle.message}</p>
			{/if}
		</div>

		<DescriptionBox
			description_name="session-description"
			value={edit_session ? edit_session.description : ''}
		/>
		<div class="grid grid-cols-2">
			{#if !classroom_id}
				<div class="grid grid-rows-[min-content] gap-1.5">
					<Label class="text-base pl-1" for="expiration-time">Expiration Time</Label>
					<Select
						select_title={expiration_select_title}
						select_options={expiration_select_options}
						on:message={expirationOptionSelected}
					></Select>
					{#if error.errorInExpiration.message}
						<p style="color:red; margin-bottom:0;">{error.errorInExpiration.message}</p>
					{/if}
					<input type="hidden" name="selected-expiration" value={expiration_selected_option} />
				</div>
			{:else}
				<input type="hidden" name="classroom-id" value={classroom_id} />
			{/if}
			<div class="grid grid-rows-[min-content] gap-1.5">
				<Label class="text-base pl-1" for="programming-language">Programming Language</Label>
				<Select
					multiple={true}
					select_title={lang_select_title}
					select_options={lang_select_options}
					on:message={langOptionSelected}
					values={edit_session
						? getEditLanguages(edit_session.languages, data.programming_languages)
						: []}
				></Select>
				<!-- <TestSelect></TestSelect> -->
				{#if error.errorInLanguages.message}
					<p style="color:red; margin-bottom:0;">{error.errorInLanguages.message}</p>
				{/if}
				<input
					type="hidden"
					name="selected-language"
					value={JSON.stringify(lang_selected_options)}
				/>
			</div>
		</div>
		<div class="col-span-full">
			{#if error.errorInAddedExercises.message}
				<p style="color:red; margin-bottom:0;">{error.errorInAddedExercises.message}</p>
			{/if}
			<ExerciseList {added_exercise_list} {remaining_exercise_list} on:message={handleMessage} />
			<input type="hidden" name="added-exercise-list" value={JSON.stringify(added_exercise_list)} />
		</div>

		{#if edit_session}
			<input type="hidden" name="session-id" value={JSON.stringify(edit_session.id)} />
			<input type="hidden" name="activation-status" value={JSON.stringify(edit_session.active)} />
		{/if}
		<div></div>
		<div class="flex justify-end">
			<button
				type="submit"
				class="text-[18px] w-20 px-4 py-2 text-sm rounded-sm font-bold text-white border-2 border-[#1f2937] bg-[#1f2937] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#1f2937]"
			>
				Submit
			</button>
		</div>
	</div>
</form>
