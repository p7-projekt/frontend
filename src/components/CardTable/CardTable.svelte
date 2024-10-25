<script>
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	export let session_title = 'My session';
	export let hours_remaining = 1;

	let remaining_time = hours_remaining * 60 * 60;
	let interval;

	function startTimer() {
		interval = setInterval(() => {
			if (remaining_time > 0) {
				remaining_time--;
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}

	onMount(() => {
		startTimer();
		return () => clearInterval(interval); // Clear interval if the component is destroyed
	});

	$: hours = Math.floor(remaining_time / 3600);
	$: minutes = Math.floor((remaining_time % 3600) / 60);
	$: seconds = remaining_time % 60;
</script>

<Card.Header>
	<Card.Title>Sessions</Card.Title>
	<Card.Description>Manage your sessions.</Card.Description>
</Card.Header>
<Card.Content>
	<section class="w-full caption-bottom text-sm">
		<header class="border-b flex justify-between hover:bg-muted/50">
			<div class="flex items-center justify-center text-muted-foreground h-12 px-4 font-medium">
				Title
			</div>

			<div class="flex items-center justify-center text-muted-foreground h-12 px-4 font-medium">
				Expires in
			</div>
			<div></div>
		</header>
		<div class="border-b flex justify-between hover:bg-muted/50">
			<div class="flex items-center justify-center h-12 px-4 font-medium">
				{session_title}
			</div>
			<div class="flex items-center justify-center h-12 px-4 font-medium">
				<p>
					{hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
				</p>
			</div>
			<div class="flex items-center justify-center h-12 px-4">
				<div class="flex justify-between">
					<button>
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
					<!-- <button>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							stroke="#1f2937"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
					</button>
					<button>
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
					</button> -->
				</div>
			</div>

			<!-- <div class="flex items-center justify-center h-12 px-4 font-medium">2023-07-12 10:42 AM</div> -->
		</div>
	</section>
</Card.Content>
