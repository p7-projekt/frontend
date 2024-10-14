<!-- ListBox.svelte (Child Component) -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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

<div class="flex w-full flex-col w-full overflow-hidden rounded-lg border-[1.5px]">
	<div class="table-header pl-1">
		<div class="flex items-center h-12 font-medium">
			{list_title} Exercises
		</div>
	</div>
	<div class="text-sm font-medium">
		<ol>
			{#if list.length !== 0}
				{#each list as list_item}
					<li
						class="pl-1 pr-1 w-[675px] h-[52px] border-b-[1.5px] flex items-center hover-effect w-full justify-between"
					>
						{#if before_item}
							<button on:click={() => sendToParent(list_item.id, list_item.content)}>
								{@html before_item}
							</button>
						{/if}
						{list_item.content}

						{#if after_item}
							<button on:click={() => sendToParent(list_item.id, list_item.content)}>
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
	.hover-effect {
		overflow: hidden;
	}
	.hover-effect:hover,
	.hover-effect:active {
		background-color: #0000000d;
	}
</style>
