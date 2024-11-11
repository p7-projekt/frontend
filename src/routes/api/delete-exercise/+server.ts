import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { fetchDeleteExercise } from '$lib/fetchRequests';

// Internal API endpoint to log the user out
export const POST: RequestHandler = async ({ request, cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	// Parse the JSON body of the request to get the exercise_id
	const { exercise_id } = await request.json();

	// Use the exercise_id in the authenticated request handler
	const response = await handleAuthenticatedRequest(
		(token) => fetchDeleteExercise(backendUrl, api_version, token, exercise_id),
		access_token,
		refresh_token,
		cookies
	);

	// Ensure that a response is returned in all cases
	if (response.ok) {
		return json({ message: 'Exercise deleted' }, { status: 200 });
	} else {
		return json({ error: 'Failed to delete exercise' }, { status: 500 });
	}
};
