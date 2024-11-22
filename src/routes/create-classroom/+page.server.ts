import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';

    const form = await request.formData();
    
	// 	const session_title = form.get('session-title');
	// 	const session_description = form.get('session-description');
	// 	const added_exercise_ids = getExerciseIds(form.get('added-exercise-list'));
	// 	const expires_in_hours = form.get('selected-expiration');
	// 	const programming_language = getProgrammingLanguages(form.get('selected-language'));
	// 	// Create the data object to validate
	// 	const new_session = {
	// 		title: session_title,
	// 		description: session_description,
	// 		expiresInHours: parseInt(expires_in_hours as string),
	// 		exerciseIds: added_exercise_ids,
	// 		languageIds: programming_language
	// 	};
	// 	// Validate against the schema
	// 	const validation = formSchema.safeParse(new_session);

	// 	if (!validation.success) {
	// 		// Return the validation errors if validation fails
	// 		return fail(400, { errors: validation.error.errors, session_description });
	// 	}

	// 	// Proceed with the validated data
	// 	debugCreateSession('Validation successful:', validation.data);

	// 	const response = await handleAuthenticatedRequest(
	// 		(token) => fetchCreateSession(backendUrl, api_version_v1, token, new_session),
	// 		access_token,
	// 		refresh_token,
	// 		cookies
	// 	);
	// 	if (response.ok) {
	// 		throw redirect(303, '/');
	// 	}
	// }
};
