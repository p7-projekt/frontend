<script lang="ts">
	import type { PageData } from './$types';
	import ListBox from '$components/Lists/ListBox.svelte';
	import SessionDisplay from './SessionDisplay.svelte';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { _deleteExercise } from './+page';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;

	const sessionData = data.sessions;

	let instructor_exercises: { id: number; content: string }[];
	if (data.instructor_exercises) {
		instructor_exercises = data.instructor_exercises.map(
			(exercise: { id: number; name: string }) => ({
				id: exercise.id,
				content: exercise.name
			})
		);
	}

	let selected_exercise_id: number | null;
	let selected_exercise_title: string | null;
	let isDialogOpen = false;

	const after_item = `<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="#1f2937"
						class="size-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>`;

	async function handleClickCreateSession() {
		goto('/create-session');
	}

	const clickDelete = async () => {
		const result = await _deleteExercise(selected_exercise_id, instructor_exercises);

		if (result) {
			({ selected_exercise_id, selected_exercise_title, instructor_exercises, isDialogOpen } =
				result);
			toast('Exercise Deleted');
		}
	};

	function openDeleteDialog(event) {
		selected_exercise_id = event.detail.item_id;
		selected_exercise_title = event.detail.item_content;
		isDialogOpen = true;
	}
</script>

{#if data.user?.role === "Instructor"}
	<div class="container pl-6 w-full text-[#333] grid grid-cols-1 gap-y-8">
		<h1 class="text-2xl font-semibold col-span-full">Instructor Home</h1>
		<div class="flex gap-x-12 h-full">
			<main class="flex flex-1 flex-col w-1/2 h-[35.5rem]">
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
								class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-5 px-10 mt-8"
								on:click={handleClickCreateSession}>Create Session</button
							>
						</div>
					</div>
				{:else}
					<SessionDisplay {sessionData} />
				{/if}
			</main>
			<div class=" h-[35.5rem] w-1/2">
				<ListBox
					list={instructor_exercises}
					list_title="Private"
					{after_item}
					on:message={openDeleteDialog}
				/>
				<!-- Create a alert dialog that forces user to confirm deletion of exercise -->
				<AlertDialog.Root open={isDialogOpen} on:close={() => (isDialogOpen = false)}>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title
								>Are you sure you want to delete {selected_exercise_title}?</AlertDialog.Title
							>
							<AlertDialog.Description>
								This action cannot be undone. This will permanently delete the exercise.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel on:click={() => (isDialogOpen = false)}>Cancel</AlertDialog.Cancel
							>
							<AlertDialog.Action on:click={clickDelete}>Delete</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>

				<div class="flex justify-end mr-1">
					<div class="flex items-center space-x-4 mt-4">
						<span class="text-[#333] font-medium text-[1.0625rem]">Create New Exercise</span>
						<button
							on:click={() => goto('/createexercise')}
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
	<div class="flex min-h-screen items-start pt-32 justify-center bg-gray-100">
		<div class="w-full max-w-md p-8 bg-white shadow-md rounded-lg text-center">
			<!-- Page Title -->
			<h1 class="text-4xl font-bold mb-4 text-gray-800">SyntaxShift</h1>
			<p class="text-lg text-gray-600 mb-8">Welcome to SyntaxShift!</p>
			
			<!-- Buttons -->
			<div class="space-y-4">
				{#if !data.user}
				<Button href="/login" class="w-full bg-blue-500 hover:bg-blue-600 text-white">
					Log In
				</Button>
				<Button href="/signup" class="w-full bg-green-500 hover:bg-green-600 text-white">
					Sign Up
				</Button>
				{/if}
				<Button href="/join" class="w-full bg-purple-500 hover:bg-purple-600 text-white">
					Join a Room
				</Button>
			</div>
		</div>
	</div>
{/if}
