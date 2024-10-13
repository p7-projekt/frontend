<script lang="ts">
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import SessionExerciseList from './SessionExerciseList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let added_exercise_list: string[] = [];
	let unadded_exercise_list: string[] = data.exercise_lists.instructor_exercise_list.map(
		(exercise: { title: string }) => exercise.title
	);
</script>

<div class="container grid grid-cols-2 gap-6 pl-6 w-full text-[#333] mt-3">
	<h1 class=" text-2xl font-semibold col-span-full">Create Session</h1>
	<div class="w-1/4 col-span-full">
		<TitleInput />
	</div>
	<DescriptionBox />
	<div></div>
	<SessionExerciseList {added_exercise_list} {unadded_exercise_list} />
</div>
