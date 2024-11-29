import { error } from 'console';
import type { PageServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const apiVersionV2 = import.meta.env.VITE_API_VERSION_V2;

export const load = (async ({ cookies, url }) => {
	const access_token: string = cookies.get('access_token') || '';
	const sessionId = url.pathname.split('/')[2];

	const response = await getTimedSession(backendUrl, apiVersionV2, access_token, sessionId);

	let jsonResponse;

	if (response.ok) {
		try {
			jsonResponse = await response.json();
		} catch (error) {
			console.error('Failed to parse JSON response:', error);
			throw new Error('Failed to parse JSON response');
		}
	} else {
		throw error(404, 'Error while getting session data');
	}

	return {
		dashData: jsonResponse
	};
}) satisfies PageServerLoad;

async function getTimedSession(
	backendUrl: string,
	api_version: string,
	access_token: string,
	sessionId: string
): Promise<Response> {
	return await fetch(`${backendUrl}/${api_version}/dashboard/${sessionId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}` // Append the Bearer token
		}
	});
}
