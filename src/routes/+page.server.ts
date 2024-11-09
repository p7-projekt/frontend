import type { PageServerLoad } from './$types';
import { fetchExerciseData, fetchSessionsData } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

export const load: PageServerLoad = async ({ cookies, depends }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	depends('data:sessions');

	if (!access_token && !refresh_token) {
		return {
			instructor_exercises: null,
			sessions: null
		};
	}

	let response = await handleAuthenticatedRequest(
		(token) => fetchExerciseData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);

	let instructor_exercises;
	if (response.ok) {
		instructor_exercises = await response.json();
	}

	response = await handleAuthenticatedRequest(
		(token) => fetchSessionsData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);

	let sessions;
	if (response.ok) {
		sessions = await response.json();
	}

	return {
		instructor_exercises: instructor_exercises,
		sessions: sessions && sessions.length > 0 ? sessions : null
	};
};
