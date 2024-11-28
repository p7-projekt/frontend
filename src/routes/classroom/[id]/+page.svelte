<script lang="ts">
	import FlexTable from '$components/FlexTable';
	import { Label } from '$lib/components/ui/label';
	import Select from '$components/Select/Select.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import {
		_deleteClassroomSession,
		_updateClassroom,
		_updateSessionActivationStatus
	} from './classroom.ts';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { goto, invalidate } from '$app/navigation';
	import CopyToClipboard from '$components/CopyToClipboard/CopyToClipboard.svelte';

	export let data: PageData;
	const user = data.user;

	let classroom: {
		id: number;
		title: string;
		description: string;
		roomcode: string;
		isOpen: boolean;
		sessions: { id: number; title: string; active: boolean }[];
	} = data.classroom;

	console.log(classroom);

	let selected_activation_status: string = 'Inactive';
	let activation_select_title: string = 'Inactive';
	let activation_select_options: { value: boolean; label: string }[] = [
		{ value: false, label: 'Inactive' },
		{ value: true, label: 'Active' }
	];

	let selected_open_status: string = 'Closed';
	let status_select_options: { value: boolean; label: string }[] = [
		{ value: false, label: 'Closed' },
		{ value: true, label: 'Open' }
	];

	let isDialogOpen = false;

	const sessionStatusSelected = async (event, session_id) => {
		selected_activation_status = event.detail.chosen_option;
		const activation_status = selected_activation_status.value;
		const result = await _updateSessionActivationStatus(session_id, classroom, activation_status);
		if (result) {
			({ classroom } = result);
			toast('Session status updated');
		}
	};

	const classroomStatusSelected = async (event, classroom_id) => {
		selected_activation_status = event.detail.chosen_option;
		const open_status = selected_activation_status.value;
		const result = await _updateClassroom(classroom_id, classroom, open_status);
		if (result) {
			({ classroom } = result);
			toast('Classroom status updated');
		}
	};

	function openDeleteDialog(event) {
		isDialogOpen = true;
	}

	const clickDelete = async (session_id) => {
		const result = await _deleteClassroomSession(session_id, classroom);

		if (result) {
			({ classroom, isDialogOpen } = result);
			toast('Session Deleted');
			if (classroom.sessions.length === 0) {
				invalidate('data:classroom');
			}
		}
	};
</script>

<div class="container grid grid-cols-1 gap-y-8 w-full text-[#333] mt-3">
	<div class="flex justify-between">
		<h1 class=" text-3xl font-semibold">{classroom.title}</h1>
		{#if user?.role === 'Instructor'}
			<div>
				<Label class="text-base font-medium">Invite Code</Label>
				<CopyToClipboard textToCopy={classroom.roomcode}></CopyToClipboard>
			</div>
		{/if}
	</div>

	<div>
		<h2 class="text-2xl font-semibold col-span-full mb-3">Description</h2>
		<p>
			{classroom.description}
		</p>
	</div>
	{#if user?.role === 'Instructor'}
		<div>
			<h2 class="text-2xl font-semibold col-span-full mb-3">Status</h2>

			<div>
				<Select
					select_options={status_select_options}
					on:message={(event) => classroomStatusSelected(event, classroom.id)}
					values={[{ value: classroom.id, label: classroom.isOpen ? 'Open' : 'Closed' }]}
				></Select>
			</div>
		</div>
	{/if}
	<section>
		<div class="flex justify-between">
			<h2 class="text-2xl font-semibold mb-3">Sessions</h2>
			{#if user?.role === 'Instructor'}
				<div class="flex justify-end items-end flex-col mb-1.5">
					<a
						href="/create-session?classroom={classroom.id}"
						class=" text-[1.125rem] px-2 py-1 text-sm rounded-sm text-white border-2 border-[#1f2937] bg-[#1f2937] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#1f2937]"
						>Create Session</a
					>
				</div>
			{/if}
		</div>
		<div class="justify-between">
			<FlexTable>
				<FlexTable.Header />
				<FlexTable.Body>
					{#each classroom.sessions as session}
						{#if (user?.role === 'Student' && session.active) || user?.role === 'Instructor'}
							<FlexTable.Row nr_cols={2} cssClass="mb-6 mt-6">
								<FlexTable.Column>
									<a href="/session/{session.id}">
										<h3 class="text-[1.375rem] mb-2 font-medium relative text-[#1971c2]">
											{session.title}
										</h3>
									</a>
								</FlexTable.Column>
								<FlexTable.Column cssClass="gap-[2rem] pl-[22rem]">
									{#if user?.role === 'Instructor'}
										<div>
											<Select
												select_title={activation_select_title}
												select_options={activation_select_options}
												on:message={(event) => sessionStatusSelected(event, session.id)}
												values={[
													{ value: session.id, label: session.active ? 'Active' : 'Inactive' }
												]}
											></Select>
										</div>
										<button
											type="button"
											class="hover:bg-[#f4f5f5] p-2 rounded-md"
											on:click={() => {
												goto(
													`/create-session?classroom=${classroom.id}&session=${session.id}&edit=true`
												);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-6"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
												/>
											</svg>
										</button>
										<button
											type="button"
											class="hover:bg-[#f4f5f5] p-2 rounded-md"
											on:click={openDeleteDialog}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="#e63946"
												class="size-6"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
												/>
											</svg>
										</button>
									{:else}
										<div class="flex justify-end items-end flex-col mb-1.5 pl-[12.3rem]">
											<a
												href="/session/{session.id}"
												class=" text-[1.125rem] px-2 py-1 text-sm rounded-sm text-white border-2 border-[#1f2937] bg-[#1f2937] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#1f2937]"
												>View</a
											>
										</div>
									{/if}
								</FlexTable.Column>
							</FlexTable.Row>
						{/if}

						<!-- Create a alert dialog that forces user to confirm deletion of exercise -->
						<AlertDialog.Root open={isDialogOpen} on:close={() => (isDialogOpen = false)}>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title
										>Are you sure you want to delete {session.title}?</AlertDialog.Title
									>
									<AlertDialog.Description>
										This action cannot be undone. This will permanently delete the session.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel on:click={() => (isDialogOpen = false)}
										>Cancel</AlertDialog.Cancel
									>
									<AlertDialog.Action class="bg-[#e63946]" on:click={() => clickDelete(session.id)}
										>Delete</AlertDialog.Action
									>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					{/each}
				</FlexTable.Body>
			</FlexTable>
		</div>
	</section>
</div>
