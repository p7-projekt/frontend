import { fail, redirect, type Actions } from '@sveltejs/kit';
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
		}
	];
	return { instructor_exercises };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const session_title = form.get('session-title');
		const session_description = form.get('session-description');
		const added_exercise_list = form.get('added-exercise-list');
		const unadded_exercise_list = form.get('unadded-exercise-list');

		// Parse the JSON strings back into arrays
		let addedExercises = [];
		let unaddedExercises = [];

		try {
			addedExercises = added_exercise_list ? JSON.parse(added_exercise_list.toString()) : [];
			unaddedExercises = unadded_exercise_list ? JSON.parse(unadded_exercise_list.toString()) : [];
		} catch (error) {
			console.error('Error parsing exercise lists:', error);
		}

		// Log the parsed exercise lists to the console
		console.log('Added exercises:', addedExercises);
		console.log('Unadded exercises:', unaddedExercises);

		// Check if session title is provided
		if (!session_title) {
			return fail(400, { sessionTitleMissing: true, session_description });
		}

		// Temporary redirect to the home page
		throw redirect(303, '/');
	}
};
