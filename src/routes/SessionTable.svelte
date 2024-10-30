<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { invalidate } from '$app/navigation';
	import FlexTable from '$components/FlexTable/index';
	import Timer from '$components/Timer/Timer.svelte';
	// import FlexTable from '$components/FlexTable/FlexTable.svelte';

	export let sessionData: { id: number; title: string; expiresInMinutes: string }[] = [];

	let sessions = sessionData;

	const deleteSession = async (sessionId) => {
		const response = await fetch('/api/delete-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ session_id: sessionId })
		});

		if (response.ok) {
			sessions = sessions.filter((session) => session.id !== sessionId);
			console.log(sessions);
			if (sessions.length === 0) {
				invalidate('data:sessions');
			}
		}
	};
</script>

<Card.Header>
	<Card.Title>Sessions</Card.Title>
</Card.Header>
<Card.Content>
	<FlexTable>
		<FlexTable.Header>
			<FlexTable.Column>Title</FlexTable.Column>
			<FlexTable.Column>Expires in</FlexTable.Column>
		</FlexTable.Header>
		<FlexTable.Body>
			{#each sessions as session (session.id)}
				<FlexTable.Column>{session.title}</FlexTable.Column>
				<FlexTable.Column><Timer seconds_remaining={session.expiresInSeconds} /></FlexTable.Column>
				<FlexTable.Column />
				<FlexTable.Column
					><div class="flex items-center justify-center h-12 px-4">
						<button on:click={() => deleteSession(session.id)}>
							<svg
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
						</button>
					</div>
				</FlexTable.Column>
			{/each}
		</FlexTable.Body>
	</FlexTable>
	<!-- <FlexTable {table_header} content_list={sessions} on:message={deleteSession} /> -->
</Card.Content>
