import { fetchSpecificSession, handleAuthenticatedRequest } from '$lib/requestHandler';
import { jwtDecode } from 'jwt-decode';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const anon_token = cookies.get('anon_token') || '';
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	if (anon_token) {
		let decoded_token;
		try {
			decoded_token = jwtDecode(anon_token) as {
				'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
			};
		} catch (error) {
			console.error('Invalid token:', error.message);
			decoded_token = null;
		}

		let user_id;
		if (decoded_token) {
			user_id = decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
		}

		console.log(user_id);

		const response = await fetch(`${backendUrl}${api_version}/sessions/${user_id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${anon_token}`
			}
		});

		console.log(response);
	} else if (access_token) {
		let response = await handleAuthenticatedRequest(
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
	}
};
