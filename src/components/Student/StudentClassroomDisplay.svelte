<script lang="ts"> 
	import Timer from '$components/Timer/Timer.svelte'; 
	import { slide } from 'svelte/transition'; 
	import * as Card from '$lib/components/ui/card/index.js';

	export let classroomData: { id: number; title: string; expiresInSeconds: number }[] = [];

	let classrooms = classroomData;  
</script>

<Card.Header>
	<Card.Title class="text-[1.25rem]">Classrooms</Card.Title>
</Card.Header>
<Card.Content>
	<div class="grid grid-cols-1 gap-4 overflow-y-auto scrollable-list">
		{#each classrooms as classroom (classroom.id)}
			<div class="rounded-[1.5rem] p-[1.5rem] border-[1.5px]" out:slide>
				<h2 class="text-[1.375rem] mb-2 font-medium relative">
					<a href="/classroom/{classroom.id}">
						{classroom.title}
					</a> 
				</h2> 
			</div>
		{/each}
	</div>
</Card.Content> 

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
