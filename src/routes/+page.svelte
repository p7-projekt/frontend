<script lang="ts">
	import type { PageData } from './$types';
	import ListBox from '$components/Lists/ListBox.svelte';
	import { goto } from '$app/navigation';
	import CardTable from '$components/CardTable/CardTable.svelte';

	export let data: PageData;

	// let session_id = data.sessions ? data.sessions[0].id : undefined;
	// let session_title = data.sessions ? data.sessions[0].title : undefined;
	let sessionData = data.sessions;
	let instructor_exercises = data.instructor_exercises.map(
		(exercise: { id: number; title: string }) => ({
			id: exercise.id,
			content: exercise.title
		})
	);

	const after_item = `<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="#1f2937"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
`;

	async function handleClickCreateSession() {
		goto('/create-session');
	}
</script>

{#if data.user}
	<div class="container pl-6 w-full text-[#333] grid grid-cols-1 gap-y-8">
		<h1 class=" text-2xl font-semibold col-span-full">Instructor Home</h1>
		<div class="flex gap-x-12 h-full">
			<main class="flex flex-1 flex-col w-1/2 max-h-[35.5rem]">
				{#if !data.sessions}
					<div
						class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
					>
						<div class="flex flex-col items-center gap-1 text-center">
							<h3 class="text-2xl font-bold tracking-tight">You have no Sessions</h3>
							<p class="text-muted-foreground text-sm">
								You can start instructing as soon as you add a session.
							</p>
							<button
								class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-6 px-12 mt-8"
								on:click={handleClickCreateSession}>Session</button
							>
						</div>
					</div>
				{:else}
					<div class="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm">
						<main class="w-full">
							<CardTable {sessionData} />
						</main>
					</div>
				{/if}
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
