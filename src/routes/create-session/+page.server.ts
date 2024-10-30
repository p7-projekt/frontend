import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	handleAuthenticatedRequest,
	fetchExerciseData,
	fetchCreateSession
} from '$lib/requestHandler';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const load: PageServerLoad = async ({ cookies }) => {
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';
	if (!access_token && !refresh_token) {
		return {
			instructor_exercises: null
		};
	}

	const response = await handleAuthenticatedRequest(
		(token) => fetchExerciseData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);
	let instructor_exercises;
	if (response.ok) {
		instructor_exercises = await response.json();
	}

	return { instructor_exercises };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';

		const form = await request.formData();
		const session_title = form.get('session-title');
		const session_description = form.get('session-description');
		const added_exercise_list = form.get('added-exercise-list');
		const expires_in_hours = form.get('selected-expiration');
		console.log(session_title, expires_in_hours);

		// Parse the JSON strings back into arrays
		let added_exercises: { id: number; title: string }[] = [];
		let date_time = {};

		try {
			added_exercises = added_exercise_list ? JSON.parse(added_exercise_list.toString()) : [];
		} catch (error) {
			console.error('Error parsing exercise lists:', error);
		}

		const added_exercise_ids = added_exercises ? added_exercises.map(({ id }) => id) : [];

		if (!session_title) {
			return fail(400, {
				sessionTitleMissing: true,
				session_description,
				expirationMissing: false
			});
		}
		if (!expires_in_hours) {
			return fail(400, {
				sessionTitleMissing: false,
				session_description,
				expirationMissing: true
			});
		}

		const new_session = {
			title: session_title.toString(),
			description: session_description?.toString(),
			expiresInHours: parseInt(expires_in_hours.toString()),
			exerciseIds: added_exercise_ids
		};

		console.log(new_session);

		const response = await handleAuthenticatedRequest(
			(token) => fetchCreateSession(backendUrl, api_version, token, new_session),
			access_token,
			refresh_token,
			cookies
		);

		if (response.ok) {
			console.log(response);
			throw redirect(303, '/');
		}
	}
};
