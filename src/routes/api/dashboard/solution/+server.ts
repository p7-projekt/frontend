import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION_V2;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	const { exerciseId, userId } = await request.json();

	// Use the exerciseId and userId in the authenticated request handler
	const response = await handleAuthenticatedRequest(
		(token) => fetchSolution(backendUrl, api_version, token, exerciseId, userId),
		access_token,
		refresh_token,
		cookies
	);

	// Ensure that a response is returned in all cases
	if (response.ok) {
		const data = await response.json();
		return json(data, { status: 200 });
	} else {
		const responseText = await response.text(); // Get the response text
		console.error('Failed to fetch solution:', response.status, responseText);
		return json({ error: 'Failed to fetch solution' }, { status: response.status });
	}
};

async function fetchSolution(
	backendUrl: string,
	api_version: string,
	access_token: string,
	exerciseId: string,
	userId: string
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/dashboard/solution/${exerciseId}/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
}
