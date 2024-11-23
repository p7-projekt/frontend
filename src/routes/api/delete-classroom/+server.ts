import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { fetchDeleteClassroom } from '$lib/fetchRequests';

// Internal API endpoint to log the user out
export const POST: RequestHandler = async ({ request, cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION_V2;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	// Parse the JSON body of the request to get the session_id
	const { classroom_id } = await request.json();

	// Use the session_id in the authenticated request handler
	const response = await handleAuthenticatedRequest(
		(token) => fetchDeleteClassroom(backendUrl, api_version, token, classroom_id),
		access_token,
		refresh_token,
		cookies
	);
	console.log(response);
	// Ensure that a response is returned in all cases
	if (response.ok) {
		return json({ message: 'Classroom deleted' }, { status: 200 });
	} else {
		return json({ error: 'Failed to delete Classroom' }, { status: 500 });
	}
};
