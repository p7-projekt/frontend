import { fetchSpecificSession, handleAuthenticatedRequest } from '$lib/requestHandler';
import { error, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION;
	const anon_token = cookies.get('anon_token') || '';
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	if (anon_token) {
		const response = await fetch(`${backendUrl}/${api_version}/sessions/${params.id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${anon_token}`
			}
		});

		let session;
		if (response.ok) {
			session = await response.json();
		} else if (response.status === 404) {
			throw error(404, 'Session not found');
		} else {
			cookies.delete('anon_token', { path: '/', secure: false });
			throw redirect(303, '/join');
		}
		return {
			session: session ? session : null
		};
	} else if (access_token) {
		const response = await handleAuthenticatedRequest(
			(token) => fetchSpecificSession(backendUrl, api_version, token, params.id),
			access_token,
			refresh_token,
			cookies
		);
		let session;
		if (response.ok) {
			session = await response.json();
		}
		return {
			session: session ? session : null
		};
	} else throw redirect(303, '/join');
};
