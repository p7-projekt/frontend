import type { PageServerLoad } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

export const load: PageServerLoad = async ({ cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

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

async function fetchSessionsData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/sessions`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

async function fetchExerciseData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	return await fetch(`${backendUrl}${api_version}/exercises`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}
