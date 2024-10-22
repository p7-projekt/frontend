import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const instructor_exercises = [
		{
			id: 1,
			title: 'Create Hello World Function'
		},
		{
			id: 2,
			title: 'Add two numbers'
		},
		{
			id: 3,
			title: 'Counter'
		},
		{
			id: 4,
			title: 'Counter 2'
		},
		{
			id: 5,
			title: 'Simple calculator'
		},
		{
			id: 6,
			title: 'Simple calculator 2'
		},
		{
			id: 7,
			title: 'Simple calculator 3'
		},
		{
			id: 8,
			title: 'Binary tree'
		},
		{
			id: 9,
			title: 'Binary tree 2'
		},
		{
			id: 10,
			title: 'Linked list'
		},
		{
			id: 11,
			title: 'Linked list'
		},
		{
			id: 12,
			title: 'Linked list'
		},
		{
			id: 13,
			title: 'Linked list'
		},
		{
			id: 14,
			title: 'Linked list'
		},
		{
			id: 15,
			title: 'Linked list'
		}
	];

	const sessions: { id: number; title: string }[] = [
		// {
		// 	id: 1,
		// 	title: 'My Session'
		// }
	];

	return {
		instructor_exercises: instructor_exercises,
		sessions: sessions && sessions.length > 0 ? sessions : null
	};
};
