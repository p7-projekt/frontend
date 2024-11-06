// Helper function to insert an item into a sorted array

export function insertInSortedOrder(list, item) {
	const index = list.findIndex((existingItem) => existingItem.id > item.id);
	if (index === -1) {
		// If no larger item found, insert at the end
		return [...list, item];
	} else {
		// Insert at the correct position
		return [...list.slice(0, index), item, ...list.slice(index)];
	}
}

// Update added Exercise list and remaining exercise list based on what which is clicked
export function updateLists(
	list_id: number,
	new_item_id: number,
	new_item_content: string,
	added_exercise_list: { id: number; content: string }[],
	remaining_exercise_list: { id: number; content: string }[]
) {
	if (list_id === 1) {
		added_exercise_list = added_exercise_list.filter((item) => item.id !== new_item_id);
		remaining_exercise_list = insertInSortedOrder(remaining_exercise_list, {
			id: new_item_id,
			content: new_item_content
		});
		return [added_exercise_list, remaining_exercise_list];
	} else if (list_id === 2) {
		remaining_exercise_list = remaining_exercise_list.filter((item) => item.id !== new_item_id);
		added_exercise_list = insertInSortedOrder(added_exercise_list, {
			id: new_item_id,
			content: new_item_content
		});
		return [added_exercise_list, remaining_exercise_list];
	} else {
		// Throw an error if list_id is not 1 or 2
		throw new Error(`Invalid list_id: ${list_id}. Expected 1 or 2.`);
	}
}
