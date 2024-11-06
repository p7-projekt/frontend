<!-- ListBox.svelte (Child Component) -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { Item } from '$lib/components/ui/dropdown-menu';
	import { createEventDispatcher } from 'svelte';
	import { fly, slide } from 'svelte/transition';

	export let list_id: number;
	export let list_title: string = '';
	export let list: { id: number; content: string }[] = [];
	export let before_item: string = '';
	export let after_item: string = '';

	const dispatch = createEventDispatcher();

	// Function to dispatch data to the parent
	function sendToParent(itemId: number, itemContent: string) {
		dispatch('message', { list_id: list_id, item_id: itemId, item_content: itemContent });
	}
</script>

<div class="flex flex-col w-full h-full rounded-lg border-[1.5px]">
	<div class="table-header pl-1">
		<div class="flex items-center h-12 font-medium">
			{list_title} Exercises
		</div>
	</div>
	<div class="text-sm font-medium overflow-y-auto scrollable-list">
		<ol class="w-full">
			{#if list.length !== 0}
				{#each list as list_item (list_item.id)}
				
				<li
						in:fly={{ y: 20 }}
						out:slide
						class="pl-1 pr-2 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover:bg-muted/50 w-full justify-between"
					>
						{#if before_item}
							<button type="button" on:click={() => sendToParent(list_item.id, list_item.content)}>
								{@html before_item}
							</button>
						{/if}
						<button on:click={() => goto(`/createexercise?edit=true&exerciseid=${list_item.id}`)}>
							{list_item.content}
						</button>

						{#if after_item}
							<button type="button" on:click={() => sendToParent(list_item.id, list_item.content)}>
								{@html after_item}
							</button>
						{/if}
					</li>
				{/each}
			{/if}
		</ol>
	</div>
</div>

<style>
	.table-header {
		background-color: #0000000d;
	}

	.scrollable-list::-webkit-scrollbar {
		width: 2px; /* Make scrollbar width smaller */
	}

	/* Scrollbar handle */
	.scrollable-list::-webkit-scrollbar-thumb {
		background-color: #cccccf; /* Optional: scrollbar handle color */
		border-radius: 10px; /* Optional: rounded edges for the handle */
	}

	/* Hover state for scrollbar handle */
	.scrollable-list::-webkit-scrollbar-thumb:hover {
		background-color: #aaa;
	}
</style>
