<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ListBox from './ListBox.svelte';

	export let added_exercise_list: { id: number; content: string }[] = [];
	export let remaining_exercise_list: { id: number; content: string }[] = [];

	let receive_message: string = '';
	let before_item: string = `
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="#1f2937"
								class="size-6 cursor-pointer"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
								/>
							</svg>`;

	let after_item = `<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="#1f2937"
		class="size-6 cursor-pointer"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
	</svg>`;

	// Helper function to insert an item into a sorted array
	function insertInSortedOrder(list, item) {
		const index = list.findIndex((existingItem) => existingItem.id > item.id);
		if (index === -1) {
			// If no larger item found, insert at the end
			return [...list, item];
		} else {
			// Insert at the correct position
			return [...list.slice(0, index), item, ...list.slice(index)];
		}
	}

	// Event handler that updates the when elements are removed and added from them using the arrows
	function handleMessage(event) {
		receive_message = event.detail;

		if (receive_message.list_id === 1) {
			added_exercise_list = added_exercise_list.filter(
				(item) => item.id !== receive_message.item_id
			);
			remaining_exercise_list = insertInSortedOrder(remaining_exercise_list, {
				id: receive_message.item_id,
				content: receive_message.item_content
			});
		} else if (receive_message.list_id === 2) {
			remaining_exercise_list = remaining_exercise_list.filter(
				(item) => item.id !== receive_message.item_id
			);
			added_exercise_list = insertInSortedOrder(added_exercise_list, {
				id: receive_message.item_id,
				content: receive_message.item_content
			});
		}
		sendToParent();
	}

	const dispatch = createEventDispatcher();

	function sendToParent() {
		dispatch('message', {
			added_exercise_list: added_exercise_list
		});
	}
</script>

<ListBox
	list_id={1}
	list_title="Added"
	list={added_exercise_list}
	{after_item}
	on:message={handleMessage}
/>

<ListBox
	list_id={2}
	list_title="Instructor"
	list={remaining_exercise_list}
	{before_item}
	on:message={handleMessage}
/>
