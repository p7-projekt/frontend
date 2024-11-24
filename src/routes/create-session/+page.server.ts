import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	fetchExerciseData,
	fetchCreateSession,
	fetchLanguageData,
	fetchCreateClassroomSession
} from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { getExerciseIds, getProgrammingLanguages } from './create_session';
import { classroomSessionSchema, formSchema } from './schema';
import { debugCreateSession } from '$lib/debug';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version_v1 = import.meta.env.VITE_API_VERSION_V1;
const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;

export const load: PageServerLoad = async ({ cookies, url }) => {
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';
	if (!access_token && !refresh_token) {
		return {
			instructor_exercises: null,
			programming_languages: null,
			classroom_id: null
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

	// if related to classroom return classroom
	const classroom_id = url.searchParams.get('classroom') || null;
	return {
		instructor_exercises,
		programming_languages,
		classroom_id
	};
};

export const actions: Actions = {
	oneOffSession: async ({ request, cookies }) => {
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';

		const form = await request.formData();
		const session_title = form.get('session-title');
		const session_description = form.get('session-description');
		const added_exercise_ids = getExerciseIds(form.get('added-exercise-list'));
		const expires_in_hours = form.get('selected-expiration');
		const programming_language = getProgrammingLanguages(form.get('selected-language'));

		const new_session = {
			title: session_title,
			description: session_description,
			expiresInHours: parseInt(expires_in_hours as string),
			exerciseIds: added_exercise_ids,
			languageIds: programming_language
		};

		const validation = formSchema.safeParse(new_session);

		if (!validation.success) {
			return fail(400, { errors: validation.error.errors, session_description });
		}

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
	},

	classroomSession: async ({ request, cookies }) => {
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';

		// Get input form create session form
		const form = await request.formData();
		const classroom_id = form.get('classroom-id');
		const session_title = form.get('session-title');
		const session_description = form.get('session-description');
		const added_exercise_ids = getExerciseIds(form.get('added-exercise-list'));
		const programming_language = getProgrammingLanguages(form.get('selected-language'));
		const new_classroom_session = {
			title: session_title,
			description: session_description,
			exerciseIds: added_exercise_ids,
			languageIds: programming_language
		};

		// Validate session
		const validation = classroomSessionSchema.safeParse(new_classroom_session); // Assuming a schema without expiration
		if (!validation.success) {
			return fail(400, { errors: validation.error.errors, session_description });
		}
		debugCreateSession('Validation successful for classroom session:', validation.data);
		const response = await handleAuthenticatedRequest(
			(token) =>
				fetchCreateClassroomSession(
					backendUrl,
					api_version_v2,
					token,
					new_classroom_session,
					classroom_id
				),
			access_token,
			refresh_token,
			cookies
		);
		if (response.ok) {
			throw redirect(303, `/classroom/${classroom_id}`);
		}
	}
};
