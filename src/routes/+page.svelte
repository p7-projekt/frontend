<script lang="ts">
	import type { PageData } from './$types';
	import ListBox from '$components/Lists/ListBox.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let active_session = data.sessions ? 'View' : 'Create';

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

	async function handleClick() {
		if (data.sessions) {
			goto('/');
		} else {
			goto('/create-session');
		}
	}
</script>

{#if data.user}
	<div class="container pl-6 w-full text-[#333]">
		<div class="grid h-full grid-cols-1 gap-y-12">
			<div></div>
			<h1 class=" text-2xl font-semibold col-span-full">Instructor Home</h1>
			<div class="flex justify-around">
				<div class="flex items-center justify-center w-1/2 h-[19.3rem]">
					<button
						class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-6 px-12"
						on:click={handleClick}>{active_session} Session</button
					>
				</div>
				<div class=" max-h-[35.5rem] w-1/2">
					<ListBox list={instructor_exercises} list_title="Private" {after_item}></ListBox>
				</div>
			</div>
		</div>
	</div>
{:else}
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{/if}
