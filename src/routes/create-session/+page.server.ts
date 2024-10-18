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

		// Parse the JSON strings back into arrays
		let added_exercises = [];

		try {
			added_exercises = added_exercise_list ? JSON.parse(added_exercise_list.toString()) : [];
		} catch (error) {
			console.error('Error parsing exercise lists:', error);
		}

		// Check if session title is provided
		if (!session_title) {
			return fail(400, { sessionTitleMissing: true, session_description });
		}

		const new_session = {
			title: session_title,
			description: session_description,
			exercises: added_exercises
		};

		console.log(new_session);

		// Make request to backend API with data (Not implemented)

		// try {
		// 	const response = await fetch('https://api.example.com/endpoint', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			Authorization: 'Bearer your_token_here' // Add auth token if required
		// 		},
		// 		body: JSON.stringify(new_session)
		// 	});

		// 	if (!response.ok) {
		// 		return fail(response.status, { error: 'Failed to post to external API' });
		// 	}

		// 	// Success: Process the response data
		// 	const responseData = await response.json();

		// 	console.log(responseData);

		// 	// Temporary redirect
		// 	throw redirect(303, '/');
		// } catch (error) {
		// 	console.error('Error posting to external API:', error);
		// 	return fail(500, { error: 'Server error ' });
		// }

		// Temporary redirect (later we redirect to session_view)
		throw redirect(303, '/');
	}
};
