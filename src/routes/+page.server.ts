import type { PageServerLoad } from './$types';
import {
	handleAuthenticatedRequest,
	fetchExerciseData,
	fetchSessionsData
} from '$lib/requestHandler';

export const load: PageServerLoad = async ({ cookies, depends }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	depends('data:sessions');

	if (!access_token && !refresh_token) {
		return {
			instructor_exercises: null,
			sessions: null
		};
	}

	const instructor_exercises = await handleAuthenticatedRequest(
		(token) => fetchExerciseData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);

	const sessions = await handleAuthenticatedRequest(
		(token) => fetchSessionsData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies
	);

	return {
		instructor_exercises: instructor_exercises,
		sessions: sessions && sessions.length > 0 ? sessions : null
	};
};
