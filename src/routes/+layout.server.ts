import { jwtDecode } from 'jwt-decode';
import type { LayoutServerLoad } from './$types';
import { handleAuthenticatedRequest } from '$lib/requestHandler';

async function fetchUserData(
	backendUrl: string,
	api_version: string,
	access_token: string
): Promise<Response> {
	let decoded_token;
	try {
		decoded_token = jwtDecode(access_token) as {
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

	return await fetch(`${backendUrl}${api_version}/users/${user_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
}

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const access_token = cookies.get('access_token') || '';
	const refresh_token = cookies.get('refresh_token') || '';

	if (!access_token) {
		return { user: null };
	}

	const userData = await handleAuthenticatedRequest(
		(token) => fetchUserData(backendUrl, api_version, token),
		access_token,
		refresh_token,
		cookies,
		fetch
	);

	const user = {
		name: userData.name
	};
	return {
		user
	};
};
