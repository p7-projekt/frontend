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
	<div class="container pl-6 w-full text-[#333] grid grid-cols-1 gap-y-6">
		<h1 class=" text-2xl font-semibold col-span-full">Instructor Home</h1>
		<div class="flex gap-x-12 h-full">
			<main class="flex flex-1 flex-col w-1/2 max-h-[35.5rem]">
				<div class="flex items-center">
					<!-- <h1 class="text-lg font-semibold md:text-2xl">Intructor Home</h1> -->
				</div>
				<div
					data-x-chunk-name="dashboard-02-chunk-1"
					data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
					class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
				>
					<div class="flex flex-col items-center gap-1 text-center">
						<h3 class="text-2xl font-bold tracking-tight">You have no Sessions</h3>
						<p class="text-muted-foreground text-sm">
							You can start instructing as soon as you add a session.
						</p>
						<button
							class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-6 px-12 mt-8"
							on:click={handleClick}>{active_session} Session</button
						>
					</div>
				</div>
			</main>
			<div class=" max-h-[35.5rem] w-1/2">
				<ListBox list={instructor_exercises} list_title="Private" {after_item}></ListBox>
				<div class="flex justify-end mr-1">
					<div class="flex items-center space-x-4 mt-4">
						<span class="text-[#333] font-medium text-[1.0625rem]">Create New Exercise</span>
						<button
							class="bg-[#1f2937] hover:bg-[#e9eaeb] hover:text-[#1f2937] flex items-center justify-center rounded-full w-7 h-7 text-white font-bold transition duration-300 ease-in-out hover:scale-110"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="#1f2937"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{/if}
