<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Timer from '$components/Timer/Timer.svelte';
	import { slide } from 'svelte/transition';
	export let sessionData: { id: number; title: string; expiresInMinutes: string }[] = [];

	let sessions = sessionData.map((session) => ({
		id: session.id,
		title: session.title,
		expiresInSeconds: parseInt(session.expiresInMinutes) * 60,
		interval: null
	}));

	const deleteSession = async (sessionId: number) => {
		const response = await fetch('/api/delete-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ session_id: sessionId })
		});

		if (response.ok) {
			sessions = sessions.filter((session) => session.id !== sessionId);
		}
	};
</script>

<Card.Header>
	<Card.Title>Sessions</Card.Title>
	<Card.Description>Manage your sessions.</Card.Description>
</Card.Header>
<Card.Content>
	<section class="w-full caption-bottom text-sm">
		<header class="border-b grid grid-cols-4 hover:bg-muted/50">
			<div class="flex items-center text-muted-foreground h-12 px-4 font-medium">Session ID</div>
			<div class="flex items-center justify-center text-muted-foreground h-12 px-4 font-medium">
				Title
			</div>
			<div class="flex items-center justify-center text-muted-foreground h-12 px-4 font-medium">
				Expires in
			</div>
			<div></div>
		</header>
		{#each sessions as session (session.id)}
			<div class="border-b grid grid-cols-4 hover:bg-muted/50" out:slide>
				<div class="flex items-center h-12 px-4 font-medium">{session.id}</div>
				<div class="flex items-center justify-center h-12 px-4 font-medium">{session.title}</div>
				<div class="flex items-center justify-center h-12 px-4 font-medium">
					<Timer seconds_remaining={session.expiresInSeconds} />
				</div>
				<div class="flex items-center justify-center h-12 px-4">
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
			</div>
		{/each}
	</section>
</Card.Content>
