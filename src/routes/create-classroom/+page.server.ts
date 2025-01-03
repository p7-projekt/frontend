import { fail, redirect, type Actions } from '@sveltejs/kit';
import { formSchema } from './schema';
import { debugCreateClassroom } from '$lib/debug';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { fetchCreateClassroom } from '$lib/fetchRequests';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_API_VERSION_V2;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';
		const form = await request.formData();

		const classroom_title = form.get('classroom-title');
		const classroom_description = form.get('classroom-description');

		// Create the data object to validate
		const new_classroom = {
			title: classroom_title,
			description: classroom_description
		};
		// Validate against the schema
		const validation = formSchema.safeParse(new_classroom);

		if (!validation.success) {
			// Return the validation errors if validation fails
			return fail(400, { errors: validation.error.errors, classroom_description });
		}

		// 	// Proceed with the validated data
		debugCreateClassroom('Validation successful:', validation.data);

		const response = await handleAuthenticatedRequest(
			(token) => fetchCreateClassroom(backendUrl, api_version, token, new_classroom),
			access_token,
			refresh_token,
			cookies
		);
		if (response.ok) {
			throw redirect(303, '/');
		}
	}
};
