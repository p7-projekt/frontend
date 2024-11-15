<script lang="ts">
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import ExerciseList from '$components/Lists/ExerciseList.svelte';
	import Select from '$components/Select/Select.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { displayValidationErrors } from './create_session';

	export let data: PageData;
	export let form: ActionData;

	let added_exercise_list: { id: number; content: string }[] = [];
	let receive_message;

	// Values for the select expiration time Select component
	let expiration_select_title: string = 'Expires in';
	let expiration_select_options: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	let expiration_selected_option: string = '';
	let expiration_post_option_str = 'hour(s)';

	// Values for the programming language Select component
	let lang_select_title: string = 'Choose Language';
	let lang_select_options: string[] = ['Haskell', 'Python'];
	let lang_selected_options: string[];

	$: displayValidationErrors(form);

	// To make the ListBox component as resuable as possible we map Exercise properties to the parameters of the ListComponent
	let remaining_exercise_list = data.instructor_exercises.map(
		(exercise: { id: number; name: string }) => ({
			id: exercise.id,
			content: exercise.name
		})
	);

	function handleMessage(event) {
		receive_message = event.detail;
		added_exercise_list = receive_message.added_exercise_list;
	}

	function expirationOptionSelected(event) {
		expiration_selected_option = event.detail.chosen_option;
	}

	function langOptionSelected(event) {
		lang_selected_options = event.detail.chosen_options;
	}

	$: error = displayValidationErrors(form);
</script>

<form method="post" use:enhance>
	<div class="container grid grid-cols-2 gap-6 pl-6 w-full text-[#333] mt-3">
		<div></div>
		<div class="flex justify-end cursor-pointer">
			<a href="/">
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
			<TitleInput input_name="session-title" />
			{#if error.errorInTitle}
				<p style="color:red; margin-bottom:0;">Session title is required</p>
			{/if}
		</div>

		<DescriptionBox description_name="session-description" />
		<div class="grid grid-cols-2">
			<div class="grid grid-rows-[min-content] gap-1.5">
				<Label class="text-base pl-1" for="expiration-time">Expiration Time</Label>
				<Select
					select_title={expiration_select_title}
					select_options={expiration_select_options}
					post_option_str={expiration_post_option_str}
					on:message={expirationOptionSelected}
				></Select>
				{#if error.errorInExpiration}
					<p style="color:red; margin-bottom:0;">Expiration time required</p>
				{/if}
				<input type="hidden" name="selected-expiration" value={expiration_selected_option} />
			</div>
			<div class="grid grid-rows-[min-content] gap-1.5">
				<Label class="text-base pl-1" for="programming-language">Programming Language</Label>
				<Select
					multiple={true}
					select_title={lang_select_title}
					select_options={lang_select_options}
					on:message={langOptionSelected}
				></Select>
				{#if error.errorInLanguages}
					<p style="color:red; margin-bottom:0;">Programming language required</p>
				{/if}
				<input
					type="hidden"
					name="selected-language"
					value={JSON.stringify(lang_selected_options)}
				/>
			</div>
		</div>
		<div class="col-span-full">
			{#if error.errorInAddedExercises}
				<p style="color:red; margin-bottom:0;">You must add an exercise to the session</p>
			{/if}
			<ExerciseList {added_exercise_list} {remaining_exercise_list} on:message={handleMessage} />
			<input type="hidden" name="added-exercise-list" value={JSON.stringify(added_exercise_list)} />
		</div>

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
