import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const exercises = [
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
		}
	];

	// if (!added_exercise_list) {
	// 	throw error(404, 'Exercises not found!');
	// }
	return {
		exercise_lists: {
			instructor_exercise_list: exercises
		}
	};
};
