<script lang="ts">
	import { slide } from 'svelte/transition';
	import * as Card from '$lib/components/ui/card/index.js';
	import { goto } from '$app/navigation';

	export let classroomData: { id: number; title: string; description: string }[] = [];

	let classrooms = classroomData;
</script>

<Card.Header class="p-0 mb-1">
	<Card.Title class="text-[1.25rem]">Classrooms</Card.Title>
</Card.Header>
<Card.Content class="p-0 mb-6">
	<div class="grid grid-cols-1 gap-4 overflow-y-auto scrollable-list">
		{#each classrooms as classroom (classroom.id)}
			<div class="rounded-[1.5rem] p-[1.5rem] border border-gray-300 shadow-md" out:slide>
				<h2 class="text-[1.375rem] mb-2 font-medium relative">
					<a href="/classroom/{classroom.id}">
						{classroom.title}
					</a>
				</h2>
				{classroom.description}
			</div>
		{/each}
	</div>
</Card.Content>
<div class="flex flex-1 items-center justify-center rounded-lg border border-gray-300 shadow-md">
	<div class="flex flex-col items-center gap-1 text-center">
		<h3 class="text-2xl font-bold tracking-tight">Join Another Classroom</h3>
		<p class="text-muted-foreground text-sm">Click here to join another classroom</p>
		<button
			class="bg-[#1f2937] text-white hover:bg-transparent hover:text-[#1f2937] ease-in-out duration-300 p-6 rounded-lg shadow-lg text-xl py-5 px-10 mt-8"
			on:click={() => goto('/join')}>Join Classroom</button
		>
	</div>
</div>

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
