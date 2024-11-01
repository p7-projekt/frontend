import { jwtDecode } from 'jwt-decode';
import type { PageServerLoad } from '../$types';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_V1;
	const anon_token = cookies.get('anon_token') || '';

	if (anon_token) {
		let decoded_token;
		try {
			decoded_token = jwtDecode(anon_token) as {
				'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
			};
		} catch (e) {
			cookies.delete('anon_token', { path: '/' });
			throw redirect(303, '/join');
		}
		let user_id;
		if (decoded_token) {
			user_id = decoded_token['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
		}

		if (user_id) {
			const response = await fetch(`${backendUrl}${api_version}/users/${user_id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${anon_token}`
				}
			});
			if (response.ok) {
				const resJSON = await response.json();
				throw redirect(303, `/session/${resJSON.sessionId}`);
			} else if (response.status === 401) {
				cookies.delete('anon_token', { path: '/' });
				throw redirect(303, '/join');
			} else throw redirect(303, '/join');
		}
	} else redirect(303, '/join');
};
