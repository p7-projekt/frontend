import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchExerciseData, fetchCreateSession } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { getExerciseIds, getProgrammingLanguages } from './create_session';
import { formSchema } from './schema';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_API_VERSION;

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
		const added_exercise_ids = getExerciseIds(form.get('added-exercise-list'));
		const expires_in_hours = form.get('selected-expiration');
		const programming_language = getProgrammingLanguages(form.get('selected-language'));

		// Create the data object to validate
		const new_session = {
			title: session_title,
			description: session_description,
			added_exercise_ids,
			expires_in_hours: expires_in_hours,
			programming_language: programming_language
		};

		// Validate against the schema
		const validation = formSchema.safeParse(new_session);

		if (!validation.success) {
			console.log(validation.error);
			// Return the first validation error message if validation fails
			return fail(400, { error: validation.error.errors[0].message });
		}

		// Proceed with the validated data
		console.log('Validation successful:', validation.data);

		// // TODO look into zod validation
		// if (!session_title) {
		// 	return fail(400, {
		// 		sessionTitleMissing: true,
		// 		session_description,
		// 		expirationMissing: false,
		// 		languageMissing: false
		// 	});
		// }
		// if (!expires_in_hours) {
		// 	return fail(400, {
		// 		sessionTitleMissing: false,
		// 		session_description,
		// 		expirationMissing: true,
		// 		languageMissing: false
		// 	});
		// }
		// if (!programming_language) {
		// 	return fail(400, {
		// 		sessionTitleMissing: false,
		// 		session_description,
		// 		expirationMissing: false,
		// 		languageMissing: true
		// 	});
		// }

		// const new_session = {
		// 	title: session_title.toString(),
		// 	description: session_description?.toString(),
		// 	expiresInHours: parseInt(expires_in_hours.toString()),
		// 	exerciseIds: added_exercise_ids
		// };

		const response = await handleAuthenticatedRequest(
			(token) => fetchCreateSession(backendUrl, api_version, token, new_session),
			access_token,
			refresh_token,
			cookies
		);
		console.log(response);
		if (response.ok) {
			throw redirect(303, '/');
		}
	}
};
