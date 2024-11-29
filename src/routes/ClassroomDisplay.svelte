<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { invalidate } from '$app/navigation';
	import { _deleteClassroom, _getDescriptionExcerpt } from './+page';
	import { toast } from 'svelte-sonner';

	export let classroom_list: { id: number; title: string; description: string }[];

	let visibleRows = 1; // Number of rows to display
	const columns = 2; // Number of columns in the grid
	let selected_classroom_id: number | null;
	let selected_classroom_title: string | null;
	let isDialogOpen = false;

	function showMore() {
		if (visibleRows * columns < classroom_list.length) {
			visibleRows++;
		}
	}

	function openDeleteDialog(classroom) {
		selected_classroom_id = classroom.id;
		selected_classroom_title = classroom.title;
		isDialogOpen = true;
	}

	const clickDelete = async () => {
		const result = await _deleteClassroom(selected_classroom_id, classroom_list);

		if (result) {
			({ classroom_list, isDialogOpen, selected_classroom_id, selected_classroom_title } = result);
			toast('Classroom Deleted');
			if (classroom_list.length === 0) {
				invalidate('data:sessions');
			}
		}
	};
</script>

<Card.Header class="p-0  mb-2">
	<Card.Title class="text-[1.25rem]">Classrooms</Card.Title>
</Card.Header>
<Card.Content class="p-0 mb-2">
	<ul class="grid grid-cols-2 gap-[2rem]">
		{#each classroom_list.slice(0, visibleRows * columns) as classroom (classroom.id)}
			<li>
				<div
					class="h-[19rem] w-full border pb-[0.25rem] pt-[2.25rem] px-[0.75rem] relative overflow-hidden"
				>
					<div>
						<a href="/classroom/{classroom.id}">
							<h2 class="text-[1.25rem] mb-2 font-medium">{classroom.title}</h2>
						</a>
						<button class="absolute right-2 top-2" on:click={() => openDeleteDialog(classroom)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="#1f2937"
								class="size-6"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>
						</button>
						<p>{_getDescriptionExcerpt(classroom.description)}</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</Card.Content>

<!-- Show More Button -->
{#if visibleRows * columns < classroom_list.length}
	<div class=" text-center mb-0">
		<button on:click={showMore} class="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">
			...
		</button>
	</div>
{/if}

<!-- Create a alert dialog that forces user to confirm deletion of session -->
<AlertDialog.Root open={isDialogOpen} on:close={() => (isDialogOpen = false)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				Are you sure you want to delete {selected_classroom_title}?
			</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the classroom.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => (isDialogOpen = false)}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class="bg-[#e63946]" on:click={clickDelete}>Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
