<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import ExerciseList from '$components/Lists/ExerciseList.svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let added_exercise_list: { id: number; content: string }[] = [];
	let receive_message: string = '';

	// To make the ListBox component as resuable as possible we map Exercise properties to the parameters of the ListComponent
	let remaining_exercise_list = data.instructor_exercises.map(
		(exercise: { id: number; title: string }) => ({
			id: exercise.id,
			content: exercise.title
		})
	);

	function handleMessage(event) {
		receive_message = event.detail;
		added_exercise_list = receive_message.added_exercise_list;
	}
	$: session_description =
		typeof form?.session_description === 'string' ? form.session_description : '';
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
		<h1 class=" text-2xl font-semibold col-span-full">Create Session</h1>

		<div class="w-1/4 col-span-full">
			<TitleInput input_name="session-title" />
			{#if form?.sessionTitleMissing}
				<p style="color:red; margin-bottom:0;">Session title is required</p>
			{/if}
		</div>

		<DescriptionBox description_name="session-description" value={form?.session_description} />
		<div></div>
		<ExerciseList {added_exercise_list} {remaining_exercise_list} on:message={handleMessage} />
		<input type="hidden" name="added-exercise-list" value={JSON.stringify(added_exercise_list)} />

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
