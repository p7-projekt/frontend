<script lang="ts">
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import SessionExerciseList from './SessionExerciseLists.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container grid grid-cols-1 gap-y-6 pl-6 w-full text-[#333] mt-3">
	<h1 class=" text-2xl font-semibold">Create Session</h1>
	<div class="w-1/5">
		<TitleInput />
	</div>
	<div class="w-2/5">
		<DescriptionBox />
	</div>
	<SessionExerciseList exercise_lists={data.exercise_lists} />
</div>
