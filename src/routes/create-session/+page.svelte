<script lang="ts">
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import ExerciseList from './ExerciseList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let added_exercise_list: { id: number; content: string }[] = [];

	// To make the ListBox component as resuable as possible we map Exercise properties to the parameters of the ListComponent
	let unadded_exercise_list = data.instructor_exercises.map(
		(exercise: { id: number; title: string }) => ({
			id: exercise.id,
			content: exercise.title
		})
	);
</script>

<div class="container grid grid-cols-2 gap-6 pl-6 w-full text-[#333] mt-3">
	<h1 class=" text-2xl font-semibold col-span-full">Create Session</h1>
	<div class="w-1/4 col-span-full">
		<TitleInput />
	</div>
	<DescriptionBox />
	<div></div>
	<ExerciseList {added_exercise_list} {unadded_exercise_list} />
</div>
