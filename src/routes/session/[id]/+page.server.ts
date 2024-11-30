import { fetchClassroomSession, fetchSpecificSession } from '$lib/fetchRequests';
import { handleAuthenticatedRequest } from '$lib/requestHandler';
import { error, redirect } from '@sveltejs/kit';
import { availableLanguages } from '$lib/availableLanguages';

export const load: PageServerLoad = async ({ cookies, url, params }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION_V1;
	const api_version2 = import.meta.env.VITE_API_VERSION_V2;
	const anon_token = cookies.get('anon_token') || '';
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';
	const isClassroom = url.searchParams.get('classroom') === 'true';
    const fetchUrl = isClassroom
        ? `${backendUrl}/${api_version2}/classrooms/session/${params.id}`
        : `${backendUrl}/${api_version}/sessions/${params.id}`;

	if (anon_token) {
		const response = await fetch(fetchUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${anon_token}`
			}
		});

		let session;
		if (response.ok) {
			session = await response.json();
			availableLanguages.set(session.languages);
		} else if (response.status === 404) {
			throw error(404, 'Session not found');
		} else {
			cookies.delete('anon_token', { path: '/', secure: false });
			throw redirect(303, '/join');
		}
		return {
			session: session
		};
	} else if (access_token) {
		const fetchFunction = isClassroom ? fetchClassroomSession : fetchSpecificSession;
		const response = await handleAuthenticatedRequest(
			(token) => fetchFunction(backendUrl, api_version2, token, params.id),
			access_token,
			refresh_token,
			cookies
		);
		let session;
		if (response.ok) {
			session = await response.json();
			availableLanguages.set(session.languages);
		}
		return {
			session: session
		};
	} else throw redirect(303, '/join');
};
