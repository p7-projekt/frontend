<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { invalidate, goto } from '$app/navigation';
	import { _deleteSession } from './+page';
	import Timer from '$components/Timer/Timer.svelte';
	import CopyToClipboard from '$components/CopyToClipboard/CopyToClipboard.svelte';
	import { slide } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Card from '$lib/components/ui/card/index.js';

	export let sessionData: { id: number; title: string; expiresInSeconds: number }[] = [];

	let sessions = sessionData;
	let selected_session_id: number | null;
	let selected_session_title: string | null;
	let isDialogOpen = false;

	const clickDelete = async () => {
		const result = await _deleteSession(selected_session_id, sessions);

		if (result) {
			({ sessions, isDialogOpen, selected_session_id, selected_session_title } = result);
			toast('Session Deleted');
			if (sessions.length === 0) {
				invalidate('data:sessions');
			}
		}
	};

	function openDeleteDialog(session) {
		selected_session_id = session.id;
		selected_session_title = session.title;
		isDialogOpen = true;
	}

	function handleDashboardClick(id: number) {
		goto(`/session/${id}/dashboard`);
	}
</script>

<Card.Header class="p-0">
	<Card.Title class="text-[1.25rem]">Sessions</Card.Title>
</Card.Header>
<Card.Content class="p-0">
	<div class="grid grid-cols-1 gap-4 overflow-y-auto scrollable-list">
		{#each sessions as session (session.id)}
			<div class="rounded-[1.5rem] p-[1.5rem] border border-gray-300 shadow-md bg-[#fff]" out:slide>
				<h2 class="text-[1.375rem] mb-2 font-medium relative">
					<a href="/session/{session.id}">
						{session.title}
					</a>
					<button class="absolute right-0 top-0" on:click={() => openDeleteDialog(session)}>
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
				</h2>
				<div class="grid grid-cols-3">
					<div>
						<Label class="text-base font-medium">Invite Code</Label>
						<CopyToClipboard textToCopy={session.sessionCode}></CopyToClipboard>
					</div>
					<div class="relative">
						<button
							class="absolute bottom-0 flex gap-1 bg-[#1f2937] text-white hover:bg-[#e9eaeb] hover:text-[#1f2937] p-2 rounded"
							on:click={() => handleDashboardClick(session.id)}
						>
							Dashboard
						</button>
					</div>
					<div class="relative">
						<div class="absolute right-0 bottom-0 flex gap-1">
							<span class="font-medium">Expires in:</span>
							<Timer seconds_remaining={session.expiresInSeconds}></Timer>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</Card.Content>

<!-- Create a alert dialog that forces user to confirm deletion of session -->
<AlertDialog.Root open={isDialogOpen} on:close={() => (isDialogOpen = false)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				>Are you sure you want to delete {selected_session_title}?</AlertDialog.Title
			>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the session.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => (isDialogOpen = false)}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class="bg-[#e63946]" on:click={clickDelete}>Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<style>
	.scrollable-list > div {
		transition: opacity 0.3s ease;
	}

	.scrollable-list::-webkit-scrollbar {
		width: 3px;
	}

	.scrollable-list::-webkit-scrollbar-thumb {
		background-color: #cccccf;
		border-radius: 10px;
	}

	.scrollable-list::-webkit-scrollbar-thumb:hover {
		background-color: #aaa;
	}
</style>
