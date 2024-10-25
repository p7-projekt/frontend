import { redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { LayoutServerLoad } from './$types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api_version = import.meta.env.VITE_V1;

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	if (!access_token) {
		return { user: null };
	}

	// Decode access token to get id of user
	let decoded_token;
	try {
		decoded_token = jwtDecode(access_token) as {
			'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
		};
	} catch (error) {
		console.error('Invalid token:', error.message);
		decoded_token = null;
	}
	if (decoded_token) {
		const user_id =
			decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];

		// const test_token = 'LOL';

		const response = await fetch(`${backendUrl}${api_version}/users/${user_id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});

		if (response.ok) {
			const userRes = await response.json();
			const user = {
				name: userRes.name
			};
			return {
				user
			};
		}
		// if response fails, probably due to invalid access token, use redirect token if redirect token exist
		// else log user out
		if (response.status === 401 && refresh_token) {
			const response = await fetch('/api/refresh', { method: 'POST' });
			if (response.ok) {
				throw redirect(303, '/');
			}
		} else {
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });

			throw redirect(303, '/');
		}
	} else {
		const response = await fetch('/api/refresh', { method: 'POST' });
		if (response.ok) {
			throw redirect(303, '/');
		}
	}
};
