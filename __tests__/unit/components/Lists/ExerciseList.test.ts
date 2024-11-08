import { describe, it, expect } from 'vitest';
import { insertInSortedOrder, updateLists } from '../../../../src/components/Lists/ExerciseList';

describe('insertInSortedOrder function', () => {
	it('inserts list item at the beginning if it has the smallest id', () => {
		const list = [{ id: 2 }, { id: 3 }];
		const list_item = { id: 1 };
		const result = insertInSortedOrder(list, list_item);
		expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
	});

	it('inserts list item in the middle if it has an id between other list items', () => {
		const list = [{ id: 1 }, { id: 3 }];
		const list_item = { id: 2 };
		const result = insertInSortedOrder(list, list_item);
		expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
	});

	it('inserts list_item at the end if it has the largest id', () => {
		const list = [{ id: 1 }, { id: 2 }];
		const list_item = { id: 3 };
		const result = insertInSortedOrder(list, list_item);
		expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
	});

	it('inserts list item into an empty list', () => {
		const list = [];
		const list_item = { id: 1 };
		const result = insertInSortedOrder(list, list_item);
		expect(result).toEqual([{ id: 1 }]);
	});

	it('maintains list order when list item has a duplicate id', () => {
		const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const list_item = { id: 2 };
		const result = insertInSortedOrder(list, list_item);
		expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }]);
	});
});

describe('updateLists function', () => {
	it('moves an item from added_exercise_list to remaining_exercise_list (list_id 1)', () => {
		let added_exercise_list = [
			{ id: 1, content: 'Exercise 1' },
			{ id: 3, content: 'Exercise 3' }
		];
		let remaining_exercise_list = [{ id: 2, content: 'Exercise 2' }];
		const list_id = 1;
		const new_item_id = 1;
		const new_item_content = 'Exercise 1';

		[added_exercise_list, remaining_exercise_list] = updateLists(
			list_id,
			new_item_id,
			new_item_content,
			added_exercise_list,
			remaining_exercise_list
		);

		expect(added_exercise_list).toEqual([{ id: 3, content: 'Exercise 3' }]);
		expect(remaining_exercise_list).toEqual([
			{ id: 1, content: 'Exercise 1' },
			{ id: 2, content: 'Exercise 2' }
		]);
	});

	it('moves an item from remaining_exercise_list to added_exercise_list (list_id 2)', () => {
		let added_exercise_list = [{ id: 3, content: 'Exercise 3' }];
		let remaining_exercise_list = [
			{ id: 1, content: 'Exercise 1' },
			{ id: 2, content: 'Exercise 2' }
		];
		const list_id = 2;
		const new_item_id = 2;
		const new_item_content = 'Exercise 2';

		[added_exercise_list, remaining_exercise_list] = updateLists(
			list_id,
			new_item_id,
			new_item_content,
			added_exercise_list,
			remaining_exercise_list
		);

		expect(added_exercise_list).toEqual([
			{ id: 2, content: 'Exercise 2' },
			{ id: 3, content: 'Exercise 3' }
		]);
		expect(remaining_exercise_list).toEqual([{ id: 1, content: 'Exercise 1' }]);
	});

	it('moves an item from added_exercise_list to remaining_exercise_list (list_id 1) when remaining_exercise_list is empty', () => {
		let added_exercise_list = [{ id: 1, content: 'Exercise 1' }];
		let remaining_exercise_list: { id: number; content: string }[] = [];
		const list_id = 1;
		const new_item_id = 1;
		const new_item_content = 'Exercise 1';

		[added_exercise_list, remaining_exercise_list] = updateLists(
			list_id,
			new_item_id,
			new_item_content,
			added_exercise_list,
			remaining_exercise_list
		);

		expect(added_exercise_list).toEqual([]);
		expect(remaining_exercise_list).toEqual([{ id: 1, content: 'Exercise 1' }]);
	});

	it('moves an item from remaining_exercise_list to added_exercise_list (list_id 2) when added_exercise_list is empty', () => {
		let added_exercise_list: { id: number; content: string }[] = [];
		let remaining_exercise_list = [{ id: 1, content: 'Exercise 1' }];
		const list_id = 2;
		const new_item_id = 1;
		const new_item_content = 'Exercise 1';

		[added_exercise_list, remaining_exercise_list] = updateLists(
			list_id,
			new_item_id,
			new_item_content,
			added_exercise_list,
			remaining_exercise_list
		);

		expect(added_exercise_list).toEqual([{ id: 1, content: 'Exercise 1' }]);
		expect(remaining_exercise_list).toEqual([]);
	});

	it('throws an invalid list error if list_id is not 1 or 2', () => {
		const added_exercise_list = [{ id: 3, content: 'Exercise 3' }];
		const remaining_exercise_list = [
			{ id: 1, content: 'Exercise 1' },
			{ id: 2, content: 'Exercise 2' }
		];

		const list_id = 3;
		const new_item_id = 1;
		const new_item_content = 'Exercise 1';

		expect(() =>
			updateLists(
				list_id,
				new_item_id,
				new_item_content,
				added_exercise_list,
				remaining_exercise_list
			)
		).toThrow('Invalid list_id: 3. Expected 1 or 2.');
	});
});
