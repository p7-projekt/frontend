import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { fetchSpecificClassroomSession, fetchUpdateClassroomSession } from '$lib/fetchRequests';

// Internal API endpoint to log the user out
export const POST: RequestHandler = async ({ request, cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	// Parse the JSON body of the request to get the session_id
	const { classroom_id, session_id, activation_status } = await request.json();

	// Use the session_id in the authenticated request handler
	let response = await handleAuthenticatedRequest(
		(token) => fetchSpecificClassroomSession(backendUrl, api_version_v2, token, session_id),
		access_token,
		refresh_token,
		cookies
	);

	// Ensure that a response is returned in all cases
	if (response.ok) {
		const session = await response.json();
		const updated_session = {
			id: session.id,
			title: session.title,
			description: session.description,
			active: activation_status,
			exerciseIds: session.exerciseIds.map((exercise) => exercise.exerciseId),
			languageIds: session.languages
		};
		response = await handleAuthenticatedRequest(
			(token) =>
				fetchUpdateClassroomSession(
					backendUrl,
					api_version_v2,
					token,
					updated_session,
					classroom_id
				),
			access_token,
			refresh_token,
			cookies
		);

		if (response.ok) {
			return json({ message: 'Session updated' }, { status: 200 });
		} else {
			return json({ error: 'Failed to update session' }, { status: 500 });
		}
	} else {
		return json({ error: 'Failed to update session' }, { status: 500 });
	}
};
