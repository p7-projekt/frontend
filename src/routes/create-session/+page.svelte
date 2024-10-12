<script lang="ts">
	import DescriptionBox from '$components/Textarea/DescriptionBox.svelte';
	import TitleInput from '$components/Input/TitleInput.svelte';
	import SessionExerciseList from './SessionExerciseLists.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-cols-2 text-[#333] mt-3">
	<div class="grid grid-cols-1 gap-y-6 pl-6 w-4/5">
		<h1 class="text-2xl font-semibold">Create Session</h1>
		<TitleInput />
		<DescriptionBox />
		<SessionExerciseList exercise_lists={data.exercise_lists} />
	</div>
</div>
