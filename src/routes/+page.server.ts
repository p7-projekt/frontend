import type { PageServerLoad } from './$types';
import { fetchExerciseData, fetchSessionsData, fetchClassroomData } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, depends, parent }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version_v1 = import.meta.env.VITE_API_VERSION_V1;
	const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';
	const { user } = await parent();

	if (user?.role === 'Student') {
		throw redirect(303, '/studenthome');
	}

	depends('data:sessions');

	if (!access_token && !refresh_token) {
		return {
			instructor_exercises: null,
			sessions: null,
			classrooms: null
		};
	}

	let response = await handleAuthenticatedRequest(
		(token) => fetchExerciseData(backendUrl, api_version_v1, token),
		access_token,
		refresh_token,
		cookies
	);

	let instructor_exercises;
	if (response.ok) {
		instructor_exercises = await response.json();
	}

	response = await handleAuthenticatedRequest(
		(token) => fetchSessionsData(backendUrl, api_version_v1, token),
		access_token,
		refresh_token,
		cookies
	);

	let sessions;
	if (response.ok) {
		sessions = await response.json();
	}

	response = await handleAuthenticatedRequest(
		(token) => fetchClassroomData(backendUrl, api_version_v2, token),
		access_token,
		refresh_token,
		cookies
	);

	let classrooms;
	if (response.ok) {
		classrooms = await response.json();
	}

	return {
		instructor_exercises:
			instructor_exercises && instructor_exercises.length > 0 ? instructor_exercises : null,
		sessions: sessions && sessions.length > 0 ? sessions : null,
		classrooms: classrooms && classrooms.length > 0 ? classrooms : null
	};
};
