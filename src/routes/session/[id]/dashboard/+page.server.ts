import { error } from 'console';
import type { PageServerLoad } from './$types';
import { getTimedSession } from '$lib/fetchRequests';

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


