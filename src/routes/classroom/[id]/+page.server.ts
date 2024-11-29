import { fetchLeaveClassroom, fetchSpecificClassroom } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { debugClassroom } from '$lib/debug';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version_v2 = import.meta.env.VITE_API_VERSION_V2;

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

export const actions: Actions = {
	leaveClassroom: async ({ request, cookies }) => {
		const access_token = cookies.get('access_token') || '';
		const refresh_token = cookies.get('refresh_token') || '';

		const form = await request.formData();
		const classroom_id = form.get('classroom-id');

		const response = await handleAuthenticatedRequest(
			(token) => fetchLeaveClassroom(backendUrl, api_version_v2, token, classroom_id),
			access_token,
			refresh_token,
			cookies
		);
		if (response.ok) {
			debugClassroom(`Student successfully left classroom ${classroom_id}`);
			throw redirect(303, '/');
		} else {
			const responseBody = await response.text(); // Read the response as text
			debugClassroom('responseBody:', responseBody);
		}
	}
};
