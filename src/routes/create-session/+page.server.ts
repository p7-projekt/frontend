import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchExerciseData, fetchCreateSession, fetchLanguageData } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { getExerciseIds, getProgrammingLanguages } from './create_session';
import { formSchema } from './schema';
import { debugCreateSession } from '$lib/debug';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version_v1 = import.meta.env.VITE_API_VERSION_V1;
const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;

export const load: PageServerLoad = async ({ cookies }) => {
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';
	if (!access_token && !refresh_token) {
		return {
			instructor_exercises: null,
			programming_languages: null
		};
	}

	const exercise_response = await handleAuthenticatedRequest(
		(token) => fetchExerciseData(backendUrl, api_version_v1, token),
		access_token,
		refresh_token,
		cookies
	);
	let instructor_exercises;
	if (exercise_response.ok) {
		instructor_exercises = await exercise_response.json();
	}

	const language_response = await handleAuthenticatedRequest(
		(token) => fetchLanguageData(backendUrl, api_version_v2, token),
		access_token,
		refresh_token,
		cookies
	);

	let programming_languages;
	if (language_response.ok) {
		programming_languages = await language_response.json();
	}

	return {
		instructor_exercises,
		programming_languages
	};
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
			expiresInHours: parseInt(expires_in_hours as string),
			exerciseIds: added_exercise_ids,
			languageIds: programming_language
		};
		// Validate against the schema
		const validation = formSchema.safeParse(new_session);

		if (!validation.success) {
			// Return the validation errors if validation fails
			return fail(400, { errors: validation.error.errors, session_description });
		}

		// Proceed with the validated data
		debugCreateSession('Validation successful:', validation.data);

		const response = await handleAuthenticatedRequest(
			(token) => fetchCreateSession(backendUrl, api_version_v1, token, new_session),
			access_token,
			refresh_token,
			cookies
		);
		if (response.ok) {
			throw redirect(303, '/');
		}
	}
};
