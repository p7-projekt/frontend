import { get_anon_userID } from './session';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const api_version = import.meta.env.VITE_API_VERSION;
	const anon_token = cookies.get('anon_token') || '';

	if (anon_token) {
		const user_id = get_anon_userID(anon_token, cookies);

		if (user_id) {
			const response = await fetch(`${backendUrl}/${api_version}/users/${user_id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${anon_token}`
				}
			});
			if (response.ok) {
				const resJSON = await response.json();
				throw redirect(303, `/session/${resJSON.sessionId}`);
			} else {
				cookies.delete('anon_token', { path: '/', secure: false });
				throw redirect(303, '/join');
			}
		}
	} else throw redirect(303, '/join');
};
