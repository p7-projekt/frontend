<script lang="ts">
	import type { PageData } from './$types';
	import ListBox from '$components/Lists/ListBox.svelte';
	import SessionDisplay from './SessionDisplay.svelte';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { _deleteExercise } from './+page';
	import { toast } from 'svelte-sonner';
	import ClassroomDisplay from './ClassroomDisplay.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;

	const sessionData = data.sessions;
	const classrooms = data.classrooms;

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

	onMount(() => {
		if (!data.user) {
			goto('/join');
		}
	});
</script>

{#if data.user?.role === 'Instructor'}
	<div class="container pl-6 w-full text-[#333] grid grid-cols-1 gap-y-8">
		<h1 class="text-2xl font-semibold col-span-full">Instructor Home</h1>
		<div class="flex gap-x-12 h-full">
			<main class="flex flex-col w-1/2 h-[40rem] justify-between">
				<div class="scrollable-list h-full flex-col flex justify-between p-2 overflow-auto">
					{#if data.classrooms}
						<ClassroomDisplay classroom_list={classrooms} />
						<div class="flex justify-end mr-1 mb-2">
							<div class="flex items-center space-x-4">
								<span class="text-[#333] font-medium text-[1.0625rem]">Create Classroom</span>
								<button
									on:click={() => goto('/create-classroom')}
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
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										/>
									</svg>
								</button>
							</div>
						</div>
					{:else}
						<div
							class="flex flex-1 items-center justify-center rounded-lg border border bg-[#fff] border-gray-300 shadow-md"
						>
							<div class="flex flex-col items-center gap-1 text-center">
								<h3 class="text-2xl font-bold tracking-tight">Classrooms</h3>
								<p class="text-muted-foreground text-sm">
									Create classrooms for your students to complete sessions and exercises.
								</p>
								<a
									href="/create-classroom"
									class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-5 px-10 mt-8"
									>Create Classroom
								</a>
							</div>
						</div>
					{/if}
					{#if !data.sessions}
						<div
							class="flex flex-1 items-center justify-center rounded-lg border border-gray-300 shadow-md bg-[#fff]"
						>
							<div class="flex flex-col items-center gap-1 text-center">
								<h3 class="text-2xl font-bold tracking-tight">One-off Sessions</h3>
								<p class="text-muted-foreground text-sm">
									If you simply desire to create a temporary session with exercises for your
									students.
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
				</div>
			</main>
			<div class=" h-[40rem] w-1/2 p-2">
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
							<AlertDialog.Action class="bg-[#e63946]" on:click={clickDelete}
								>Delete</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>

				<div class="flex justify-end mr-1 mt-2">
					<div class="flex items-center space-x-4">
						<span class="text-[#333] font-medium text-[1.0625rem]">Create Exercise</span>
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
{/if}

<style>
	.scrollable-list {
		overflow-y: scroll; /* Enable vertical scrolling */
		overflow-x: hidden; /* Disable horizontal scrolling */
		scrollbar-width: none; /* For Firefox: hide scrollbar */
		-ms-overflow-style: none; /* For IE and Edge: hide scrollbar */
	}

	/* For WebKit browsers (Chrome, Safari, etc.) */
	.scrollable-list::-webkit-scrollbar {
		display: none; /* Hide scrollbar */
	}
</style>
