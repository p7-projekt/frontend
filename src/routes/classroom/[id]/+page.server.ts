import { fetchSpecificClassroom } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params, depends }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION_V2;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	depends('data:classroom');

	if (!access_token && !refresh_token) {
		return {
			classroom: null
		};
	}

	const response = await handleAuthenticatedRequest(
		(token) => fetchSpecificClassroom(backendUrl, api_version, token, params.id),
		access_token,
		refresh_token,
		cookies
	);

	let classroom;
	if (response.ok) {
		classroom = await response.json();
	} else redirect(303, '/');
	return {
		classroom: classroom ? classroom : null
	};
};
