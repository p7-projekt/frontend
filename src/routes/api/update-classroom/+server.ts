import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { fetchUpdateClassroom } from '$lib/fetchRequests';

// Internal API endpoint to log the user out
export const POST: RequestHandler = async ({ request, cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	// Parse the JSON body of the request to get the session_id
	const { classroom_id, classroom_title, classroom_description, open_status } =
		await request.json();

	const updated_classroom = {
		title: classroom_title,
		description: classroom_description,
		registrationOpen: open_status
	};

	// Use the classroom_id in the authenticated request handler
	const response = await handleAuthenticatedRequest(
		(token) =>
			fetchUpdateClassroom(backendUrl, api_version_v2, token, updated_classroom, classroom_id),
		access_token,
		refresh_token,
		cookies
	);

	if (response.ok) {
		return json({ message: 'Classroom updated' }, { status: 200 });
	} else {
		return json({ error: 'Failed to update classroom' }, { status: 500 });
	}
};
