<script lang="ts">
	import type { PageData } from './$types';
	import ListBox from '$components/Lists/ListBox.svelte';

	export let data: PageData;

	let instructor_exercises = data.instructor_exercises.map(
		(exercise: { id: number; title: string }) => ({
			id: exercise.id,
			content: exercise.title
		})
	);

	const after_item = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#1f2937" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
`;
</script>

{#if data.user}
	<div class="container grid h-full grid-cols-2 gap-6 pl-6 w-full text-[#333]">
		<div class="flex items-center justify-center">
			<button
				class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-6 px-12"
				>Session</button
			>
		</div>
		<div>
			<ListBox list={instructor_exercises} list_title="Private" {after_item}></ListBox>
		</div>
	</div>
{:else}
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{/if}
